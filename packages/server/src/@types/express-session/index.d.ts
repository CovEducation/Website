import { mongoose } from "@typegoose/typegoose";
declare module "express-session" {
  interface Session {
    userId?: mongoose.Types.ObjectId;
  }
}
