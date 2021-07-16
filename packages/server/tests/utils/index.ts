import { mongoose } from "@typegoose/typegoose";
import find from 'find-up';
import dotenv from 'dotenv';
import { MongoMemoryServer } from "mongodb-memory-server";

const envPath = find.sync(".env");
dotenv.config({ path: envPath });

// Mocking

import mockery from "mockery";
import nodemailerMock from "nodemailer-mock";
let mongod: MongoMemoryServer;
/**
 * Connect to the in-memory database.
 */
export const connect = async () => {
  // The server uses MONGO_URI by default, use the in-memory db instead.
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Tests stopped: Running with non-test credentials.");
  }

  await mongoose.disconnect();

  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

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
    if (mongod) {}
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
  // Replace all nodemailer and firebase calls with mocks.
  const firebaseMock = {
    initializeApp: () => {},
    credential: {
      cert: () => {},
    },
    auth: () => {
      return {
        verifyIdToken: (user) => {
          if (user === undefined) {
            return Promise.resolve(undefined);
          }
          return Promise.resolve({ ...user });
        },
      };
    },
  };
  const algoliaMock = () => {};
  const twilioMock = () => {
    return {
      messages: {
        create: () => {},
      }
    }
  };
  mockery.registerMock("nodemailer", nodemailerMock);
  mockery.registerMock("firebase-admin", firebaseMock);
  mockery.registerMock("mongoose-algolia", algoliaMock);
  if (process.env.TWILIO_SID !== undefined) {
    console.log("Note: Not mocking twilio SID ", process.env.TWILIO_SID);
  } else {
    console.log("Warning: Mocking twilio since TWILIO_SID is undefined.");
    mockery.registerMock("twilio", twilioMock);
  }
};

export default {
  connect,
  clearDatabase,
  closeDatabase,
  setupMocks,
};
