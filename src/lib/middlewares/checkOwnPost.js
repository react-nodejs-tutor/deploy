import Post from '../../db/models/post';

export const checkOwnPost = async (ctx, next) => {
  const { id } = ctx.params;
  try {
    const post = await Post.findById(id).exec();
    if (post.user.username === ctx.state.user.username) {
      return next();
    } else {
      ctx.status = 403;
      ctx.body = {
        message: 'forbidden',
      };
      return;
    }
  } catch (e) {
    ctx.throw(500, e);
  }
};
