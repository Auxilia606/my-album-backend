import {
  check,
  checkEmail,
  checkNickName,
  getUserPhotos,
  login,
  logout,
  register,
} from '@controllers/auth';
import { checkLoggedIn } from '@middleware';
import Router from 'koa-router';

export const auth = new Router();

auth.post('/register', register);
auth.post('/login', login);
auth.get('/check', checkLoggedIn, check);
auth.get('/photos', getUserPhotos);
auth.post('/logout', logout);
auth.post('/check/email', checkEmail);
auth.post('/check/nickname', checkNickName);
