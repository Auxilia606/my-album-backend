import { uploadImage } from '@controllers/photo';
import { checkLoggedIn } from '@middleware';
import Router from 'koa-router';

export const photo = new Router();

photo.post('/upload', checkLoggedIn, uploadImage);
