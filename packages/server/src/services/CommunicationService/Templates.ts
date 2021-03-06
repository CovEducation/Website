import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import CommunicationPreference from "../../models/CommunicationPreference";
import { MessageData } from "./CommunicationService";

/**
 * Represents all the messages that will be sent through the API.
 * When adding a new template, make sure to:
 *  1) Create a new enum
 *  2) Create a subject for the template in `templateSubjects`.
 *  3) Create a data generator in `dataGenerator`
 *  4) If sms, create a new entry in `smsGenerator`
 *  5) if email, create a new html template in the `templates` folder, and specify it's path on `getEmailTemplatePath`.
 */
export enum CommunicationTemplates {
  MENTORSHIP_REQUEST_MENTOR,
}

export const templateSubjects = {
  [CommunicationTemplates.MENTORSHIP_REQUEST_MENTOR]:
    "[URGENT][Action-Required]CovED Match!",
};

export const dataGenerators = {
  [CommunicationTemplates.MENTORSHIP_REQUEST_MENTOR]: (info: MessageData) => {
    const { parent, mentor, student, message } = info;
    if (
      parent === undefined ||
      mentor === undefined ||
      student === undefined ||
      message === undefined
    ) {
      throw new Error(
        "Templates::dataGenerators[MENTORSHIP_REQUEST_MENTOR](): Insufficient data."
      );
    }
    return {
      mentorFirst: mentor.name,
      parentName: parent.name,
      parentEmail: parent.email,
      studentName: student.name,
      message,
    };
  },
};

export const generateTemplate = (
  template: CommunicationTemplates,
  method: CommunicationPreference
) => {
  const generator = getGenerator(template, method);
  return generator;
};

const getGenerator = (
  template: CommunicationTemplates,
  method: CommunicationPreference
) => {
  if (method === CommunicationPreference.EMAIL) {
    const path = getEmailTemplatePath(template);
    const src = fs.readFileSync(path, "utf-8").toString();
    return handlebars.compile(src);
  } else if (method === CommunicationPreference.SMS) {
    return smsGenerator[template];
  } else {
    throw new Error(`Unsupported communication method: ${method}`);
  }
};

const getEmailTemplatePath = (template: CommunicationTemplates) => {
  switch (template) {
    case CommunicationTemplates.MENTORSHIP_REQUEST_MENTOR: {
      return path.join(__dirname, "templates/matchMentor.html");
    }
    default: {
      throw new Error("Unsupported template.");
    }
  }
};

const smsGenerator = {
  [CommunicationTemplates.MENTORSHIP_REQUEST_MENTOR]: (data: {
    mentorFirst: string;
    parentName: string;
    studentName: string;
    parentEmail: string;
    message: string;
  }) => {
    return `Hello ${data.mentorFirst}, you have been request by ${data.parentName} to tutor ${data.studentName}. You can contact the parent at ${data.parentEmail}. Here is their message: ${data.message}`;
  },
};

export default CommunicationTemplates;
