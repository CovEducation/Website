import {
  mentorRequirement,
  idParamRequirement,
  idBodyRequirement,
  studentRequirement,
  parentRequirement,
} from "../utils";

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
