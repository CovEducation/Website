import find from "find-up";
import dotenv from "dotenv";
import logger from "morgan";
import cors from "cors";
import compression from "compression";
import http from "http";
import fs from "fs";
import path from "path";
import express from "express";
import session from "express-session";
import firebase from "firebase-admin";
import { mongoose } from "@typegoose/typegoose";
import MainRouter from "./routes/MainRouter";
import findUp from "find-up";

const envPath = find.sync(".env");
dotenv.config({ path: envPath });

const speakerSeriesPath = find.sync("speakerSeries.json");
const ourTeamPath = find.sync("ourTeam.json");

if (speakerSeriesPath === undefined || ourTeamPath === undefined) {
  throw new Error("Initialization error: Missing static data.");
}
const validateEnv = () => {
  if (process.env.MONGO_URI === undefined) {
    throw new Error("Missing environment key: MONGO_URI");
  }
  if (process.env.DB_NAME === undefined) {
    throw new Error("Missing enviroment key: DB_NAME");
  }
  if (process.env.FIREBASE_CREDENTIALS === undefined) {
    throw new Error("Missing environment key: FIREBASE_CREDENTIALS");
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
  const speakerSeries = JSON.parse(
    fs.readFileSync(speakerSeriesPath, { encoding: "utf-8" })
  );
  const ourTeam = JSON.parse(
    fs.readFileSync(ourTeamPath, { encoding: "utf-8" })
  );
  app.use(logger("dev", { skip: () => process.env.NODE_ENV === "test" }));
  app.use(express.json({}));
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({ origin: true }));
  app.use(compression());
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "default",
      resave: false,
      saveUninitialized: false,
    })
  );
  app.get("/speakerSeries", (_, res) => {
    res.send(speakerSeries);
  });
  app.get("/ourTeam", (_, res) => {
    res.send(ourTeam);
  });

  app.use("/", MainRouter);

  app.use(express.static(appBundleDirectory));

  app.use("*", (_, res) => {
    res.sendFile(path.resolve(appBundleDirectory, "index.html"));
  });

  const {
    MONGO_URI = "",
    DB_NAME = "",
    FIREBASE_CREDENTIALS = "",
  } = process.env;
  if (process.env.NODE_ENV !== "test") {
    const firebaseCertPath = findUp.sync(FIREBASE_CREDENTIALS);
    if (firebaseCertPath === undefined) {
      throw new Error(`Invalid certificate path: ${FIREBASE_CREDENTIALS}`);
    }
    firebase.initializeApp({
      credential: firebase.credential.cert(firebaseCertPath),
    });
  }

  return mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: DB_NAME,
    })
    .then(() => {
      return new http.Server(app);
    });
};

export default createHttpServer;
