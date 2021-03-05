import { body, query, checkSchema } from "express-validator";

const mentorshipRequirementsBody = [
  body("mentorship._id").exists().isMongoId(),
  body("mentorship.sessions").exists().isArray(),
  body("mentorship.state").exists(),
];

const messageRequirementBody = body("message").exists().isString();
const requestIdsRequirement = checkSchema({
  parentID: {
    exists: true,
    isMongoId: true,
  },
  studentID: {
    exists: true,
    isMongoId: true,
  },
  mentorID: {
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
const userIdRequirementQuery = query("token").optional().isMongoId();

export const postRequestValidation = requestIdsRequirement.concat([
  messageRequirementBody,
]);

export const getMentorshipsValidation = [userIdRequirementQuery];

export const acceptMentorshipValidation = mentorshipRequirementsBody;

export const rejectMentorshipValidation = mentorshipRequirementsBody;

export const archiveMentorshipValidation = mentorshipRequirementsBody;

export const postSessionValidation = mentorshipRequirementsBody.concat([
  sessionRequirementBody,
]);
