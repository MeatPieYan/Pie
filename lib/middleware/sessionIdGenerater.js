const ZA_SESSION_NAME = '__za__session__id__';

const sessionIdGenerater = () => async (ctx, next) => {
  if (!ctx.cookies.get(ZA_SESSION_NAME)) {
    ctx.cookies.set(ZA_SESSION_NAME, `${Date.now()}${Math.random()}`, {
      httpOnly: false,
      signed: false
    });
  }
  await next();
};

module.exports = sessionIdGenerater;
