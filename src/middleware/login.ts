import type Router from 'koa-router';
import { type UserState } from './types';

export const checkLoggedIn: Router.IMiddleware<UserState> = async (
  ctx,
  next,
) => {
  if (!ctx.state.user) {
    ctx.status = 401;
    return;
  }

  return await next();
};
