import Router from 'koa-router';
import { list, write, read, remove, update } from './posts.ctrl';
import middlewares from '../../lib/middlewares';
const { isPostIdValid, isUserLoggedIn, checkOwnPost } = middlewares;

const posts = new Router();

posts.get('/', list);
posts.post('/', isUserLoggedIn, write);
posts.get('/:id', isPostIdValid, read);
posts.delete('/:id', isUserLoggedIn, isPostIdValid, checkOwnPost, remove);
posts.patch('/:id', isUserLoggedIn, isPostIdValid, checkOwnPost, update);

export default posts;
