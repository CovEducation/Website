
import find from "find-up";
import dotenv from "dotenv";
import fs from 'fs';
import { mongoose } from "@typegoose/typegoose";
import MentorModel from "../models/Mentors";


const envPath = find.sync(".env");
dotenv.config({ path: envPath });
const fname = 'mentor_emails.json';
let MONGO_URI = process.env.MONGO_URI;
let DB_NAME = process.env.DB_NAME;

if (MONGO_URI === null || MONGO_URI === undefined) {
    throw new Error("Invalid environment.");
}
mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: DB_NAME,
    })
MentorModel.find({}).then((mentors) => {
    return mentors.map((mentor) => mentor.email);
}).then((emails) => {
    fs.writeFileSync(fname, JSON.stringify(emails));
    console.log("wrote to ", fname)
})
