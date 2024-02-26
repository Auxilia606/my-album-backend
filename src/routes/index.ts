import Router from 'koa-router';
import { auth } from './auth';

export const api = new Router();

api.use('/auth', auth.routes());
