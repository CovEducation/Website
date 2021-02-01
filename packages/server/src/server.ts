import find from "find-up";
import dotenv from "dotenv";
import logger from "morgan";
import compression from "compression";
import http from "http";
import path from "path";
import express from "express";
import mongoose from "mongoose";
import MainRouter from "./routes/main/MainRouter";
const envPath = find.sync(".env");
dotenv.config({ path: envPath });

const validateEnv = () => {
  if (process.env.MONGO_URI === undefined) {
    throw new Error(`Missing environment key: MONGO_URI`);
  }
};

const appBundleDirectory = path.resolve(
  __dirname,
  "..",
  "..",
  "client",
  "build"
);
const createHttpServer = async (): Promise<http.Server> => {
  validateEnv();
  const app = express();
  app.use(logger("dev", { skip: () => process.env.NODE_ENV === "test" }));
  app.use(express.json({}));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(appBundleDirectory));
  app.use(compression());
  app.use("/", MainRouter);
  const { MONGO_URI = "" } = process.env;
  return mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      return new http.Server(app);
    });
};

export default createHttpServer;
