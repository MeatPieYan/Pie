const path = require('path');
const http = require('http');
const serve = require('koa-static');
const views = require('koa-views');
const compress = require('koa-compress');
const { uaCheckMid } = require('tac-ua');

const serverRender = require('./middleware/serverRender');
// const PieDom = require('za-piedom');
const routerGen = require('./tools/nodeRouterLoader');
const defaultConfig = {
  specialEnvList: [{
    name: 'za',
    userAgent: 'ZhongAnWebView',
    publicPath: 'index.za'
  },{
    name: 'wx',
    userAgent: 'MicroMessenger',
    publicPath: 'index.wx'
  }],
  defaultEnv: {
    name:'default',
    publicPath: 'index'
  }
};

class Pie {
  constructor(rootPath) {
    this._rootPath = rootPath;
    this._userConfig = Object.assign(defaultConfig, config);

    this._initPie();
    this._loadMiddleware();
  }

  _initPie() {
    this._app = require('./app'); // eslint-disable-line global-require
    this._server = http.createServer(this._app.callback());

    this._configPath = path.resolve(this._rootPath, './config');
    this._routerPath = path.resolve(this._rootPath, './server/router');
    // this._viewPath = path.resolve(this._rootPath, './view');
    // this._staticResourcePath = path.resolve(this._rootPath, './dist');
    this._viewPath = this._rootPath;
    this._staticResourcePath = this._rootPath;
    this._clientRoute = path.resolve(this._rootPath, './shared/router.js');
    this._reducer = path.resolve(this._rootPath, './shared/rootReducer.js');
    this._saga = path.resolve(this._rootPath, './shared/rootSaga.js');
  }

  _loadMiddleware() {
    const router = routerGen(this._routerPath);

    this._app.use(compress());
    this._app.use(views(this._viewPath, {
      map: {
        html: 'ejs'
      }
    }))
      .use(uaCheckMid(this._userConfig.containerEnv))
      .use(serverRender(this._clientRoute, this._reducer, this._saga))
      .use(router.routes())
      .use(router.allowedMethods())
      .use(serve(this._staticResourcePath));
  }

  use(mid) {
    this._app.use(mid);
  }

  startUp() {
    this._server.listen(process.env.PORT || 8080);
  }
}

module.exports = Pie;
