import { mongoose } from "@typegoose/typegoose";
import { checkSchema, query, body } from "express-validator";
import StudentModel from "../../models/Students";
import CommunicationPreference from "../../models/CommunicationPreference";

// Common fields between all types of users.
export const userRequirement = checkSchema({
  firebaseUID: {
    in: ["body"],
    isUUID: true,
  },
  name: {
    in: ["body"],
    isString: true,
  },
  email: {
    in: ["body"],
    isEmail: true,
  },
  timezone: {
    in: ["body"],
    isString: true,
  },
  phone: {
    in: ["body"],
    isMobilePhone: true,
  },
  pronouns: {
    in: ["body"],
    isString: true,
  },
  avatar: {
    in: ["body"],
    isURL: true,
  },
  communicationPreference: {
    in: ["body"],
    isIn: {
      options: [CommunicationPreference.EMAIL, CommunicationPreference.SMS],
    },
  },
});

// Requirements shared between endpoints.
export const mentorRequirement = checkSchema({
  firebaseUID: {
    in: ["body"],
    isUUID: true,
  },
  name: {
    in: ["body"],
    isString: true,
  },
  email: {
    in: ["body"],
    isEmail: true,
  },
  timezone: {
    in: ["body"],
    isString: true,
  },
  phone: {
    in: ["body"],
    isMobilePhone: true,
  },
  pronouns: {
    in: ["body"],
    isString: true,
  },
  avatar: {
    in: ["body"],
    isURL: true,
  },
  bio: {
    in: ["body"],
    isString: true,
  },
  major: {
    in: ["body"],
    isString: true,
  },
  gradeLevels: {
    in: "body",
    isArray: true,
  },
  communicationPreference: {
    in: ["body"],
    isIn: {
      options: [CommunicationPreference.EMAIL, CommunicationPreference.SMS],
    },
  },
});

export const parentRequirement = checkSchema({
  firebaseUID: {
    in: ["body"],
    isUUID: true,
  },
  name: {
    in: ["body"],
    isString: true,
  },
  email: {
    in: ["body"],
    isEmail: true,
  },
  timezone: {
    in: ["body"],
    isString: true,
  },
  phone: {
    in: ["body"],
    isMobilePhone: true,
  },
  pronouns: {
    in: ["body"],
    isString: true,
  },
  avatar: {
    in: ["body"],
    isURL: true,
  },
  students: {
    in: "body",
    isArray: true,
  },
  communicationPreference: {
    in: ["body"],
    isIn: {
      options: [CommunicationPreference.EMAIL, CommunicationPreference.SMS],
    },
  },
});

export const studentRequirement = body("students").custom((students: []) => {
  return students.every(async (student) => {
    const doc = await StudentModel.create(student);
    const valid = doc.validateSync();
    await StudentModel.findByIdAndDelete(doc._id);
    return await valid;
  });
});

export const idParamRequirement = query("_id")
  .exists({ checkFalsy: true, checkNull: true })
  .isString()
  .custom((value) => {
    return mongoose.Types.ObjectId.isValid(value);
  });

export const idBodyRequirement = body("_id")
  .exists({
    checkFalsy: true,
    checkNull: true,
  })
  .isString()
  .custom((value) => mongoose.Types.ObjectId.isValid(value));
