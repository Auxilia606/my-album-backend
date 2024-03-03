import { findByUserEmail, generateToken } from '@controllers/user';
import jwt from 'jsonwebtoken';
import type Router from 'koa-router';
import { AUTH_COOKIE_NAME, cookieOption } from './constants';
import { type UserState } from './types';

export const jwtMiddleware: Router.IMiddleware<UserState> = async (
  ctx,
  next,
) => {
  // const token = ctx.cookies.get(AUTH_COOKIE_NAME);
  const token = ctx.request.header.authorization;

  if (!token) {
    return await next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      complete: false,
    });

    if (typeof decoded === 'string' || !decoded?.exp) return await next();

    const user = await findByUserEmail(decoded.email);

    if (!user) return await next();

    ctx.state.user = user;

    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp - now > 60 * 60 * 24) return await next();

    const newToken = await generateToken(user.email, user.nickname);

    ctx.response.header.authorization = newToken;
    ctx.cookies.set(AUTH_COOKIE_NAME, newToken, cookieOption);

    return await next();
  } catch (error: any) {
    ctx.throw(500, error);
  }
};
