import { AUTH_COOKIE_NAME, cookieOption, type UserState } from '@middleware';
import { User } from '@models';
import {
  type UserDTO,
  type UserEmailDTO,
  type UserLoginDTO,
  type UserNicknameDTO,
} from '@types';
import type Router from 'koa-router';
import {
  checkPassword,
  findByUserEmail,
  findByUserNickname,
  generateToken,
  hashPassword,
} from './user';

export const register: Router.IMiddleware = async (ctx) => {
  const { email, nickname, password } = ctx.request.body as UserDTO;

  try {
    const exists = await findByUserEmail(email);

    if (exists) {
      ctx.status = 409;
      return;
    }

    const hashedPassword = await hashPassword(password);

    const user = new User({
      email,
      nickname,
      password: hashedPassword,
    });

    await user.save();

    const data: Partial<UserDTO> = user.toJSON();
    delete data.password;
    ctx.body = data;
  } catch (error: any) {
    ctx.throw(500, error);
  }
};

export const login: Router.IMiddleware = async (ctx) => {
  const { email, password } = ctx.request.body as UserLoginDTO;

  if (!email || !password) {
    ctx.status = 401;
    return;
  }

  try {
    const user = await findByUserEmail(email);

    if (!user) {
      ctx.status = 401;
      return;
    }

    const valid = await checkPassword(password, user.password);

    if (!valid) {
      ctx.status = 401;
      return;
    }

    const data: Partial<UserDTO> = user.toJSON();
    delete data.password;
    ctx.body = data;

    const token = await generateToken(user.email, user.nickname);

    ctx.cookies.set(AUTH_COOKIE_NAME, token, cookieOption);
  } catch (error: any) {
    ctx.throw(500, error);
  }
};

export const check: Router.IMiddleware<UserState> = async (ctx) => {
  const { user } = ctx.state;

  if (!user) {
    ctx.status = 401;
    return;
  }

  ctx.body = user;
};

export const getUserPhotos: Router.IMiddleware<UserState> = async (ctx) => {
  const { user } = ctx.state;

  if (!user) {
    ctx.status = 401;
    return;
  }

  ctx.body = { photos: user.photos };
};

export const logout: Router.IMiddleware = async (ctx) => {
  ctx.cookies.set(AUTH_COOKIE_NAME);
  ctx.status = 204;
};

export const checkEmail: Router.IMiddleware = async (ctx) => {
  const { email } = ctx.request.body as UserEmailDTO;
  try {
    const exists = Boolean(await findByUserEmail(email));

    ctx.body = { exists };
  } catch (error: any) {
    ctx.throw(500, error);
  }
};

export const checkNickName: Router.IMiddleware = async (ctx) => {
  const { nickname } = ctx.request.body as UserNicknameDTO;
  try {
    const exists = Boolean(await findByUserNickname(nickname));

    ctx.body = { exists };
  } catch (error: any) {
    ctx.throw(500, error);
  }
};
