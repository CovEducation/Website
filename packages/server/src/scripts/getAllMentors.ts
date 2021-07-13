
import find from "find-up";
import dotenv from "dotenv";
import {createObjectCsvWriter} from 'csv-writer';
import { mongoose } from "@typegoose/typegoose";
import MentorModel from "../models/Mentors";


const envPath = find.sync(".env");
dotenv.config({ path: envPath });
const fname = 'mentor_emails.csv';
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
    return mentors.map((mentor) => {
        return {email:mentor.email}});
}).then((emails: Array<String>) => {
    let writer = createObjectCsvWriter({path: fname, header: [{id: 'email', title: 'Email'}]});
    writer.writeRecords(emails).then(() => {
        console.log("wrote to ", fname);
    })
})
