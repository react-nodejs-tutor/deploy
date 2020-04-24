import { isPostIdValid } from './isPostIdValid';
import { isUserLoggedIn } from './isUserLoggedIn';
import { checkOwnPost } from './checkOwnPost';

const middlewares = { isPostIdValid, isUserLoggedIn, checkOwnPost };

export default middlewares;
