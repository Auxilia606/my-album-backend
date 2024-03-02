import Router from 'koa-router';
import { auth } from './auth';
import { photo } from './photo';

export const api = new Router();

api.use('/auth', auth.routes());
api.use('/photo', photo.routes());
