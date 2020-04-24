import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const { Schema } = mongoose;
const { JWT_SECRET: jwtSecret } = process.env;

const UserSchema = new Schema({
  username: String,
  password: String,
});

UserSchema.methods.setPassword = async function(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  this.password = hashedPassword;
};

UserSchema.methods.checkPassword = async function(password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

UserSchema.methods.serializeToJSON = function() {
  const serializedData = this.toJSON();
  delete serializedData.password;
  return serializedData;
};

UserSchema.methods.generateToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.username,
    },
    jwtSecret,
    {
      issuer: 'test server',
      expiresIn: '3d',
    },
  );
  return token;
};

UserSchema.statics.findByUsername = async function(username) {
  const user = await this.findOne({ username }).exec();
  return user;
};

UserSchema.statics.isUserExist = async function(username) {
  const isUserExist = await this.findOne({ username }).exec();
  if (isUserExist) {
    return true;
  } else return false;
};

const User = mongoose.model('User', UserSchema);

export default User;
