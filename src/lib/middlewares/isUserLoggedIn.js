import jwt from 'jsonwebtoken';
const { JWT_SECRET: jwtSecret } = process.env;

export const isUserLoggedIn = (ctx, next) => {
  try {
    const accessToken = ctx.cookies.get('login_access_token');
    if (!accessToken) {
      printUnauthorizedMessage(ctx);
    }
    const decodedToken = jwt.verify(accessToken, jwtSecret);
    if (decodedToken) {
      const { _id, username } = decodedToken;
      ctx.state.user = {
        _id,
        username,
      };
      return next();
    } else {
      printUnauthorizedMessage(ctx);
    }
  } catch (e) {
    printUnauthorizedMessage(ctx);
  }
};

export const printUnauthorizedMessage = ctx => {
  // 403 forbidden
  ctx.status = 403;
  ctx.body = {
    message: 'login required',
  };
  return;
};
