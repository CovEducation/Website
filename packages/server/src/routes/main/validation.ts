import { query, body } from "express-validator";

// Requirements shared between endpoints.
const numQueryRequirement = query("num").exists().isNumeric();
const numBodyRequirement = body("num").exists().isNumeric();

// Endpoint specific validation.
export const getDoubleValidation = [numQueryRequirement];
export const postNumValidation = [numBodyRequirement];
