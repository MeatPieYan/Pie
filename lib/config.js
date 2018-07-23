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
      console: {
        type: 'console'
      }
    },
    categories: {
      default: {
        appenders: [
          'console'
        ],
        level: 'all'
      }
    }
  }

};
