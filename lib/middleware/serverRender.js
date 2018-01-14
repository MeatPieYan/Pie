// const React = require('react');
const { renderToString } = require('react-dom/server');
const { matchRoutes } = require('react-router-config');
const PieDom = require('za-piedom');

/**
 * server side render middleware for koa
 *
 * this function will return a koa2 middleware which is used to
 * render the whole dom structure of the first screen from server
 * side
 *
 * @param    { path }      the path point to the client router file
 * @returns  { function }  which is the koa middleware function, like async(ctx, next) => {}
 *
 * @date     2017-12-12
 * @author   yanzhenggang<robinyzg@hotmail.com>
 */
const serverRender = (clientRoutePath, reducerPath, sagaPath) => async (ctx, next) => {
  // const routes = require(clientRoutePath); // eslint-disable-line global-require
  let routerPath = ctx.__CONTAINER__ENV__.name;
  let renderPath = ctx.__CONTAINER__ENV__.publicPath;

  if (process.env.NODE_ENV !== 'production' && process.env.DEPLOY_ENV !== 'pre' && process.env.DEPLOY_ENV !== 'prd') {
    routerPath = process.env._PLATFORM_ || 'shared';
    renderPath = process.env._PLATFORM_ || 'shared';
  }

  const routes = require(`${clientRoutePath}/${routerPath}/router.js`); // eslint-disable-line global-require
  const reducer = require(reducerPath); // eslint-disable-line global-require
  const saga = require(sagaPath); // eslint-disable-line global-require

  /**
   * ------------------------------------------------------------------
   * this is a filter used for Array.prototype.filter
   * it will filter the root router('/')
   * ------------------------------------------------------------------
   */
  const isNotRootRoute = ({ match }) => match.path !== '/';

  const { html, store } = PieDom.generateServerHtml(ctx, routes, reducer, saga);

  /**
   * ------------------------------------------------------------------
   * render a html string contains the matched route
   * ------------------------------------------------------------------
   */
  const renderHtmlString = async (inititalDataArr) => {
    /* ***************************** */
    /*          if NECESSARY         */
    /*    TODO: context handler      */
    /* TODO: inititalDataArr handler */
    /* ***************************** */
    console.log(inititalDataArr);

    // function render is added into ctx via PKG koa-views
    await ctx.render(`client/${renderPath}`, {
      root: renderToString(html),
      state: store.getState()
    });
  };

  // get all matched Routes & filter the one which is not the root one('/')
  const matchedRouter = matchRoutes(routes, ctx.request.url).filter(isNotRootRoute);

  // if there is no router matched,
  // then exit the current middleware,
  // and call the next koa middleware
  if (!Array.isArray(matchedRouter) || matchedRouter.length === 0) {
    return next();
  }

  // loop all the matched router,
  // and get the Function loadInitialData from the related component,
  // and excute them if existed,
  // and return the array of promise
  const promises = matchedRouter.map(({ route }) =>
    (route.component.loadInitialData instanceof Function ?
      route.component.loadInitialData(store)
      :
      Promise.resolve(null)));

  // trigger the saga promise ends;
  store.close();

  // render html string after all the promise resolved.
  await Promise.all(promises)
    .then(renderHtmlString)
    .catch((err) => {
      /* ***************************** */
      /*      TODO: error handler      */
      /* ***************************** */
      console.log(err);
    });
};

module.exports = serverRender;
