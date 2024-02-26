import {
  check,
  checkEmail,
  checkNickName,
  login,
  logout,
  register,
} from '@controllers/auth';
import Router from 'koa-router';

export const auth = new Router();

auth.post('/register', register);
auth.post('/login', login);
auth.get('/check', check);
auth.post('/logout', logout);
auth.post('/check/email', checkEmail);
auth.post('/check/nickname', checkNickName);
