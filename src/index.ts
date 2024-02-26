import cors from '@koa/cors';
import dotenv from 'dotenv';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import mongoose from 'mongoose';
import { jwtMiddleware } from './middleware/jwt';
import { api } from './routes';

dotenv.config();

const { PORT, MONGO_URI } = process.env;

const app = new Koa();
const router = new Router();

app.use(cors({ credentials: true }));
router.use(api.routes());

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
app.use(bodyParser());
app.use(jwtMiddleware);

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('connected to mongoose');
  })
  .catch((error) => {
    console.error(error);
  });
