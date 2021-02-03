import { mongoose } from "@typegoose/typegoose";
import { checkSchema, query, body } from "express-validator";
import StudentModel from "../../models/Students";
import NotificationPreference from "../../models/NotificationPreference";

// Requirements shared between endpoints.
const mentorRequirement = checkSchema({
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
  notificationPreference: {
    in: ["body"],
    isIn: {
      options: [NotificationPreference.EMAIL, NotificationPreference.SMS],
    },
  },
});

const parentRequirement = checkSchema({
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
  notificationPreference: {
    in: ["body"],
    isIn: {
      options: [NotificationPreference.EMAIL, NotificationPreference.SMS],
    },
  },
});

const studentRequirement = body("students").custom((students: []) => {
  return students.every((student) => {
    return StudentModel.create(student).then((doc) => doc.validateSync());
  });
});

const idParamRequirement = query("_id")
  .exists({ checkFalsy: true, checkNull: true })
  .isString()
  .custom((value) => {
    return mongoose.Types.ObjectId.isValid(value);
  });

const idBodyRequirement = body("_id")
  .exists({
    checkFalsy: true,
    checkNull: true,
  })
  .isString()
  .custom((value) => mongoose.Types.ObjectId.isValid(value));

// Endpoint specific validation.
export const postMentorValidation = mentorRequirement; // checkSchema is already a ValidationChain[]

export const getMentorValidation = [idParamRequirement];

export const deleteMentorValidation = [idBodyRequirement];

export const postParentValidation = [studentRequirement].concat(
  parentRequirement
);

export const getParentValidation = [idParamRequirement];

export const deleteParentValidation = [idBodyRequirement];

export default {
  postMentorValidation,
  getMentorValidation,
  deleteMentorValidation,
  getParentValidation,
  deleteParentValidation,
  postParentValidation,
};
