/**
 * validate whether the config file is valid or not
 *
 * validate whether the config file is valid or not.
 * check whether the key-fields which will be used in our framework contains correct contents.
 *
 * @param    {object}  config     the application.config.js
 * @returns  void
 *
 * @date     2017-12-12
 * @author   yanzhenggang<robinyzg@hotmail.com>
 */
const validateConfig = (config) => {
  config.port = config.port || 3000;
  const {
    viewPath, routerPath, staticResourcePath, clientRoutePath
  } = config;

  if (!viewPath || viewPath === '') {
    throw new Error('please fullfill the {viewPath} in your application.config.js');
  }

  if (!routerPath || routerPath === '') {
    throw new Error('please fullfill the {routerPath} in your application.config.js');
  }

  if (!staticResourcePath || staticResourcePath === '') {
    throw new Error('please fullfill the {staticResourcePath} in your application.config.js');
  }

  if (!clientRoutePath || clientRoutePath === '') {
    throw new Error('please fullfill the {clientRoutePath} in your application.config.js');
  }
};

module.exports = validateConfig;
