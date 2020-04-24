import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

export const isPostIdValid = (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    printBadRequestMessage(ctx);
  }

  return next();
};

export const printBadRequestMessage = ctx => {
  // 400 Bad Request
  ctx.status = 400;
  ctx.body = {
    message: 'request not valid',
  };
  return;
};
