const fs = require('fs');
const Router = require('koa-router');

/**
 * load all nodeJs Router
 *
 * load all files under the path passed in.
 * each file expected to return a koa-router instance.
 * all the koa-router instance will be loaded into the root router
 *
 * @param    {path}         routerPath     the path pointed to the nodeJs router
 * @returns  {koa-router}                  the nodeJs Root router contains all the subrouter
 *
 * @date     2017-12-12
 * @author   yanzhenggang<robinyzg@hotmail.com>
 */
const routerGen = (routerPath) => {
  const healthCheck = new Router();
  healthCheck.get('/health', (ctx) => { ctx.status = 200; });

  const rootRouter = new Router();
  rootRouter.use(healthCheck.routes(), healthCheck.allowedMethods());

  const router = new Router({ prefix: '/api' });
  let subRouter;

  fs.readdirSync(routerPath)
    .forEach((filename) => {
      /* eslint-disable */
      subRouter = require(`${routerPath}/${filename}`);
      /* eslint-enable */
      router.use(subRouter.routes(), subRouter.allowedMethods());
    });

  rootRouter.use(router.routes(), router.allowedMethods());

  return rootRouter;
};

module.exports = routerGen;
