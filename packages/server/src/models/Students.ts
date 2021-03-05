import { getModelForClass, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";

export interface IStudent {
  _id?: mongoose.Types.ObjectId;
  name: string;
  subjects: string[];
  gradeLevel: string;
}

export class Student implements IStudent {
  public _id?: mongoose.Types.ObjectId;

  @prop({ required: true })
  public name: string;

  @prop({ required: true })
  public gradeLevel: string;

  @prop({
    required: true,
    validate: {
      validator: (v) => v.length >= 1,
      message: "Student must select one subject.",
    },
    type: String,
  })
  public subjects: string[];
}

const StudentModel = getModelForClass(Student);

export default StudentModel;
