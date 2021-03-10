import { mongoose } from "@typegoose/typegoose";
import {
  mentorRequirementsBody,
  parentRequirementsBody,
  studentRequirementsBody,
  idRequirementBody,
  idRequirementQuery,
} from "./validation";

const ensureIDsAreEqual = (
  a: mongoose.Types.ObjectId | String,
  b: mongoose.Types.ObjectId | String
) => {
  return String(a) === String(b);
};
export {
  mentorRequirementsBody,
  parentRequirementsBody,
  studentRequirementsBody,
  idRequirementBody,
  idRequirementQuery,
  ensureIDsAreEqual,
};
