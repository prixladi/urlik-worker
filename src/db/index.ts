import mongoose from 'mongoose';
import { devEnvironment, mongoConfig } from '../configs';
import UrlModel from './url';

type DB = {
  UrlModel: typeof UrlModel;
};

const connect = async (): Promise<DB> => {
  const url = new URL(mongoConfig.databaseName, mongoConfig.url).href;

  mongoose.connection.on('connecting', function () {
    console.log('Connecting to MongoDB...');
  });

  mongoose.connection.on('connected', function () {
    console.log(`Connected to MongoDB ('${url}').`);
  });

  mongoose.set('debug', devEnvironment);

  for (;;) {
    try {
      await mongoose.connect(url, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
      });

      mongoose.connection.on('error', function (err) {
        console.error('Mongoose connection error: ', err);
      });

      mongoose.connection.on('disconnected', function () {
        console.log('Mongoose connection disconnected');
      });

      break;
    } catch (err) {
      console.error(err);
    }
  }

  return {
    UrlModel,
  };
};

const disconnect = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error while disconnecting from MongoDB:', err);
  }
};

export { connect, disconnect };
