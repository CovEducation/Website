import { mongoose } from "@typegoose/typegoose";
import { checkSchema, query } from "express-validator";
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
const idRequirement = query("_id")
  .exists({ checkFalsy: true, checkNull: true })
  .isString()
  .custom((value) => mongoose.Types.ObjectId.isValid(value));

// Endpoint specific validation.
export const postMentorValidation = mentorRequirement; // checkSchema is already a ValidationChain[]

export const getMentorValidation = [idRequirement];

export default { postMentorValidation, getMentorValidation };
