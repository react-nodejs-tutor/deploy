import Router from 'koa-router';
import { register, login, check, logout } from './auth.ctrl';
import middlewares from '../../lib/middlewares';
const { isUserLoggedIn } = middlewares;

const auth = new Router();

auth.post('/register', register);
auth.post('/login', login);
auth.post('/logout', isUserLoggedIn, logout);
auth.get('/check', isUserLoggedIn, check);

export default auth;
