import mongoose from 'mongoose';
import { devEnvironment, mongoConfig } from '../configs';
import UrlModel from './url';

const connect = async () => {
  const url = new URL(mongoConfig.databaseName, mongoConfig.url).href;
  const connection = mongoose.connection;
  connection.once('open', function () {
    console.log(`Connected to MongoDB ('${url}').`);
  });

  mongoose.set('debug', devEnvironment);
  await mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify : false
  });
};

export { UrlModel, connect };
