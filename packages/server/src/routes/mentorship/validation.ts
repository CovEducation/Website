import { body, checkSchema } from "express-validator";
import MentorshipModel from "../../models/Mentorships";
import {
  mentorRequirement,
  parentRequirement,
  studentRequirement,
  userRequirement,
} from "../utils";

const mentorshipRequirement = body("mentorship").custom((mentorship) => {
  return MentorshipModel.create(mentorship).then(async (doc) => {
    const valid = doc.validateSync();
    await MentorshipModel.findById(doc._id);
    return valid;
  });
});

const sessionRequirement = checkSchema({
  date: {
    in: ["body"],
    isDate: true,
  },
  durationMinutes: {
    in: ["body"],
    isNumeric: true,
  },
  rating: {
    in: ["body"],
    isNumeric: true,
    isFloat: { options: { min: 0, max: 1 } },
  },
});

export const postRequestValidation = [
  mentorRequirement,
  parentRequirement,
  studentRequirement,
];

export const getMentorshipsValidation = userRequirement; // checkSchema is already a ValidationChain[]

export const acceptMentorshipValidation = [mentorshipRequirement].concat(
  mentorRequirement
);

export const rejectMentorshipValidation = [mentorshipRequirement];

export const archiveMentorshipValidation = [mentorshipRequirement];

export const postSessionValidation = [mentorshipRequirement].concat(
  sessionRequirement
);
