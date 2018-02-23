const path = require('path');
const http = require('http');
const serve = require('koa-static');
const views = require('koa-views');
const compress = require('koa-compress');
const { uaCheckMid } = require('tac-ua');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const logger = require('tac-logger');
const socket = require('socket.io');

const serverRender = require('./middleware/serverRender');
const routerGen = require('./tools/nodeRouterLoader');
const config = require('./config');

class Pie {
  constructor(rootPath, _config) {
    this._rootPath = rootPath;
    this._userConfig = Object.assign(config, _config);

    this._initPie();
    this._loadMiddleware();
  }

  _initPie() {
    this._app = require('./app'); // eslint-disable-line global-require
    this._server = http.createServer(this._app.callback());

    const io = socket(this._server);
    io.on('connection', (sk) => {
      console.log('socket: new connection');
      this._app.context.io = this._app.context.io || io;
      this._app.context.skPool = Array.isArray(this._app.context.skPool) ? this._app.context.skPool.concat(sk) : [sk];
      global.__socket__ = sk;
      global.__io__ = io;
      global.__skPool__ = this._app.context.skPool;
    });

    this._configPath = path.resolve(this._rootPath, './config');
    this._routerPath = path.resolve(this._rootPath, './server/router');
    // this._viewPath = path.resolve(this._rootPath, './view');
    // this._staticResourcePath = path.resolve(this._rootPath, './dist');
    this._viewPath = this._rootPath;
    this._staticResourcePath = this._rootPath;
    this._clientRoute = path.resolve(this._rootPath);
    this._reducer = path.resolve(this._rootPath, './shared/redux/rootReducer.js');
    this._saga = path.resolve(this._rootPath, './shared/redux/rootSaga.js');
  }

  _loadMiddleware() {
    const router = routerGen(this._routerPath);

    const SESSION_CONFIG = {
      key: 'za-session', /** (string) cookie key (default is koa:sess) */
      maxAge: 86400000, /** (number) maxAge in ms (default is 1 days) */
      overwrite: true, /** (boolean) can overwrite or not (default true) */
      httpOnly: true, /** (boolean) httpOnly or not (default true) */
      signed: false /** (boolean) signed or not (default true) */
    };
    this._app.keys = ['reactXplatform'];

    this._app.use(compress())
      .use(session(SESSION_CONFIG, this._app))
      .use(bodyParser())
      .use(logger(this._userConfig.log4js))
      .use(views(this._viewPath, {
        map: {
          html: 'ejs'
        }
      }))
      .use(uaCheckMid(this._userConfig.xPlatform))
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
