import { findByUserEmail, generateToken } from '@controllers/user';
import jwt from 'jsonwebtoken';
import type Router from 'koa-router';
import { AUTH_COOKIE_NAME, cookieOption } from './constants';

export const jwtMiddleware: Router.IMiddleware = async (ctx, next) => {
  const token = ctx.cookies.get(AUTH_COOKIE_NAME);

  if (!token) {
    return await next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      complete: false,
    });

    if (typeof decoded === 'string' || !decoded?.exp) return await next();

    ctx.state.user = decoded;

    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp - now > 60 * 60 * 24) return await next();

    const user = await findByUserEmail(decoded.email);

    if (!user) return await next();

    const newToken = await generateToken(user.email, user.nickname);

    ctx.cookies.set(AUTH_COOKIE_NAME, newToken, cookieOption);

    return await next();
  } catch (error) {
    return await next();
  }
};
