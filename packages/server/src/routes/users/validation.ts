import {
  mentorRequirementsBody,
  parentRequirementsBody,
  idRequirementBody,
  idRequirementQuery,
} from "../utils";

// Endpoint specific validation.
export const postMentorValidation = mentorRequirementsBody; // checkSchema is already a ValidationChain[]
export const putMentorValidation = mentorRequirementsBody;

export const getMentorValidation = [idRequirementQuery];

export const deleteMentorValidation = [idRequirementBody];

export const postParentValidation = parentRequirementsBody;

export const putParentValidation = parentRequirementsBody;
export const getParentValidation = [idRequirementQuery];

export const deleteParentValidation = [idRequirementBody];

export default {
  postMentorValidation,
  getMentorValidation,
  deleteMentorValidation,
  getParentValidation,
  deleteParentValidation,
  postParentValidation,
};
