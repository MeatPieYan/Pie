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

  const envRouter = new Router();
  envRouter.get('/env', (ctx) => { ctx.status = 200; ctx.body = process.env.DEPLOY_ENV; });

  const rootRouter = new Router();
  rootRouter.use(healthCheck.routes(), healthCheck.allowedMethods());
  rootRouter.use(envRouter.routes(), envRouter.allowedMethods());

  const router = new Router({ prefix: '/api' });
  let subRouter;

  fs.readdirSync(routerPath)
    .filter(filename => filename.endsWith('.js'))
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
