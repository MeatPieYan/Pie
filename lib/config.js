module.exports = {
  xPlatform: {
    specialEnvList: [{
      name: 'za',
      userAgent: 'ZhongAnWebView',
      publicPath: 'index.za'
    }, {
      name: 'wx',
      userAgent: 'MicroMessenger',
      publicPath: 'index.wx'
    }],
    defaultEnv: {
      name: 'default',
      publicPath: 'index'
    }
  },

  // log4js
  log4js: {
    appenders: {
      infoLogger: {
        type: 'stdout'
      },
      errorLogger: {
        type: 'stdout'
      },
      access: {
        type: 'stdout'
      }
    },
    categories: {
      default: {
        appenders: ['infoLogger', 'access'],
        level: 'all'
      },
      error: {
        appenders: ['errorLogger'],
        level: 'error'
      }
    }
  }

};
