const http = require('http');
const serve = require('koa-static');
const views = require('koa-views');

const serverRender = require('./middleware/serverRender');
const routerGen = require('./tools/nodeRouterLoader');
const validateConfig = require('./tools/validateConfig');

class Pie {
  constructor({ configPath }) {
    this.configPath = configPath;

    this._initPie();
    this._initConfig();

    this._loadMiddleware();
  }

  _initPie() {
    this._app = require('./app'); // eslint-disable-line global-require
    this._server = http.createServer(this._app.callback());
  }

  _initConfig() {
    this._applicationConfig = require(`${this.configPath}/application.config`); // eslint-disable-line global-require
    validateConfig(this._applicationConfig);
  }

  _loadMiddleware() {
    const pie = this._app;
    const config = this._applicationConfig;

    const _viewPath = config.viewPath;
    const _routerPath = config.routerPath;
    const _staticResourcePath = config.staticResourcePath;
    const _clientRoutePath = config.clientRoutePath;

    const router = routerGen(_routerPath);

    pie.use(views(_viewPath, {
      map: {
        html: 'ejs'
      }
    }))
      .use(serverRender(_clientRoutePath))
      .use(router.routes())
      .use(router.allowedMethods())
      .use(serve(_staticResourcePath));
  }

  use(mid) {
    this._app.use(mid);
  }

  startUp() {
    this._server.listen(this._applicationConfig.port);
  }
}

module.exports = Pie;
