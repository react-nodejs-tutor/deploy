import Joi from '@hapi/joi';
import User from '../../../db/models/user';

export const register = async ctx => {
  const schema = Joi.object().keys({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(15)
      .required(),
    password: Joi.string()
      .pattern(
        new RegExp('(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}'),
      )
      .required(),
  });
  const result = schema.validate({ ...ctx.request.body });
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, password } = ctx.request.body;
  try {
    const isUserExist = await User.findByUsername(username);
    if (isUserExist) {
      ctx.status = 409;
      ctx.body = {
        message: 'username already exists',
      };
      return;
    }

    const newUser = new User({ username });

    await newUser.setPassword(password);
    await newUser.save();

    const token = await newUser.generateToken();
    ctx.cookies.set('login_access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 3,
      httpOnly: true,
    });

    const serializedData = await newUser.serializeToJSON();

    ctx.body = serializedData;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const login = async ctx => {
  const schema = Joi.object().keys({
    username: Joi.required(),
    password: Joi.required(),
  });
  const result = schema.validate({ ...ctx.request.body });
  if (result.error) {
    ctx.statuts = 401;
    ctx.body = {
      message: 'please provide username and password',
    };
  }

  const { username, password } = ctx.request.body;
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      ctx.body = {
        message: 'login failed',
      };
      return;
    }

    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      ctx.status = 401;
      ctx.body = {
        message: 'login failed',
      };
      return;
    }

    const token = await user.generateToken();
    ctx.cookies.set('login_access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 3,
      httpOnly: true,
    });

    ctx.body = {
      message: 'login success',
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const check = ctx => {
  const { user } = ctx.state;
  if (!user) {
    ctx.status = 401;
    ctx.body = {
      message: 'not authorized',
    };
    return;
  }
  ctx.body = user;
};

export const logout = ctx => {
  ctx.cookies.set('login_access_token');
  ctx.status = 204;
  return;
};
