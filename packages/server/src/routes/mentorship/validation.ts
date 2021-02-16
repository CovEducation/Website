import { body, query, checkSchema } from "express-validator";

import {
  mentorRequirementsBody,
  parentRequirementsBody,
  studentRequirementsBody,
} from "../utils/validation";

const mentorshipRequirementsBody = [
  body("mentorship._id").exists().isMongoId(),
  body("mentorship.sessions").exists().isArray(),
  body("mentorship.state").exists(),
];

const messageRequirementBody = body("message").exists().isString();
const requestIdsRequirement = checkSchema({
  "parent._id": {
    exists: true,
    isMongoId: true,
  },
  "parent.students.*._id": {
    exists: true,
    isMongoId: true,
  },
  "mentor._id": {
    exists: true,
    isMongoId: true,
  },
});
const sessionRequirementBody = body("session")
  .exists()
  .custom((value) => {
    const valid =
      value.date !== undefined &&
      value.durationMinutes > 0 &&
      value.rating >= 0 &&
      value.rating <= 1;
    return valid;
  });
const userIdRequirementQuery = query("user._id").exists().isMongoId();

export const postRequestValidation = mentorRequirementsBody
  .concat(parentRequirementsBody)
  .concat(studentRequirementsBody)
  .concat(requestIdsRequirement)
  .concat([messageRequirementBody]);

export const getMentorshipsValidation = [userIdRequirementQuery];

export const acceptMentorshipValidation = mentorRequirementsBody.concat(
  mentorshipRequirementsBody
);

export const rejectMentorshipValidation = mentorshipRequirementsBody;

export const archiveMentorshipValidation = mentorshipRequirementsBody;

export const postSessionValidation = mentorshipRequirementsBody.concat([
  sessionRequirementBody,
]);
