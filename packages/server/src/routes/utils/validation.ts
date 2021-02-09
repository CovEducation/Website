import { mongoose } from "@typegoose/typegoose";
import { checkSchema, query, body } from "express-validator";
import StudentModel from "../../models/Students";
import CommunicationPreference from "../../models/CommunicationPreference";

// Common fields between all types of users.
export const userRequirement = checkSchema({
  firebaseUID: {
    in: ["body", "query"],
    isUUID: true,
  },
  name: {
    in: ["body", "query"],
    isString: true,
  },
  email: {
    in: ["body", "query"],
    isEmail: true,
  },
  timezone: {
    in: ["body", "query"],
    isString: true,
  },
  phone: {
    in: ["body", "query"],
    isMobilePhone: true,
  },
  pronouns: {
    in: ["body", "query"],
    isString: true,
  },
  avatar: {
    in: ["body", "query"],
    isURL: true,
  },
  communicationPreference: {
    in: ["body", "query"],
    isIn: {
      options: [CommunicationPreference.EMAIL, CommunicationPreference.SMS],
    },
  },
});

// Requirements shared between endpoints.
export const mentorRequirement = checkSchema({
  firebaseUID: {
    in: ["body", "query"],
    isUUID: true,
  },
  name: {
    in: ["body", "query"],
    isString: true,
  },
  email: {
    in: ["body", "query"],
    isEmail: true,
  },
  timezone: {
    in: ["body", "query"],
    isString: true,
  },
  phone: {
    in: ["body", "query"],
    isMobilePhone: true,
  },
  pronouns: {
    in: ["body", "query"],
    isString: true,
  },
  avatar: {
    in: ["body", "query"],
    isURL: true,
  },
  bio: {
    in: ["body", "query"],
    isString: true,
  },
  major: {
    in: ["body", "query"],
    isString: true,
  },
  gradeLevels: {
    in: "body",
    isArray: true,
  },
  communicationPreference: {
    in: ["body", "query"],
    isIn: {
      options: [CommunicationPreference.EMAIL, CommunicationPreference.SMS],
    },
  },
});

export const parentRequirement = checkSchema({
  firebaseUID: {
    in: ["body", "query"],
    isUUID: true,
  },
  name: {
    in: ["body", "query"],
    isString: true,
  },
  email: {
    in: ["body", "query"],
    isEmail: true,
  },
  timezone: {
    in: ["body", "query"],
    isString: true,
  },
  phone: {
    in: ["body", "query"],
    isMobilePhone: true,
  },
  pronouns: {
    in: ["body", "query"],
    isString: true,
  },
  avatar: {
    in: ["body", "query"],
    isURL: true,
  },
  students: {
    in: "body",
    isArray: true,
  },
  communicationPreference: {
    in: ["body", "query"],
    isIn: {
      options: [CommunicationPreference.EMAIL, CommunicationPreference.SMS],
    },
  },
});

export const studentRequirement = body("students").custom((students: []) => {
  return students.every(async (student) => {
    const doc = await StudentModel.create(student);
    const valid = doc.validateSync() === undefined;
    await StudentModel.findByIdAndDelete(doc._id);
    return valid;
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
