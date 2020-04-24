import mongoose from 'mongoose';
const { MONGO_URI: uri } = process.env;

export default function connect() {
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('mongodb connection established');
    })
    .catch(err => {
      console.error(err);
    });
}
