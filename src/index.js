import {} from './envPreload';
const { PORT: port } = process.env;

import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import db from './db';
db();

import api from './api';

const app = new Koa();
const router = new Router();

router.use('/api', api.routes());

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log(`on port ${port}`);
});
