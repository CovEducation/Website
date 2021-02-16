import { mongoose } from "@typegoose/typegoose";

import { MongoMemoryServer } from "mongodb-memory-server";
// Mocking

import mockery from "mockery";
import nodemailerMock from "nodemailer-mock";

const mongod = new MongoMemoryServer();

/**
 * Connect to the in-memory database.
 */
export const connect = async () => {
  // The server uses MONGO_URI by default, use the in-memory db instead.

  await mongoose.disconnect();

  const uri = await mongod.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  await mongoose.connect(uri, mongooseOpts);
  // Useful for CI, avoids server crash when MONGO_URI is not defined.
  process.env.MONGO_URI = uri;
  process.env.DB_NAME = mongoose.connection.db.databaseName;
};

/**
 * Drop database, close the connection and stop mongod.
 */
export const closeDatabase = async () => {
  // Avoid double-closing connection: https://stackoverflow.com/questions/19599543/check-mongoose-connection-state-without-creating-new-connection
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongod.stop();
  }
};

/**
 * Remove all the data for all db collections.
 */
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

export const setupMocks = async () => {
  // We need to setup the mocks before importing CommunicationService
  // so nodemailer is actually mocked.
  mockery.enable({ warnOnReplace: false, warnOnUnregistered: false });
  // Replace all nodemailer calls with nodemailerMock
  mockery.registerMock("nodemailer", nodemailerMock);
};

export default {
  connect,
  clearDatabase,
  closeDatabase,
  setupMocks,
};
