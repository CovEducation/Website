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
  MENTORSHIP_REQUEST_PARENT,
  MENTORSHIP_ACCEPTED_MENTOR,
  MENTORSHIP_ACCEPTED_PARENT,
  MENTORSHIP_REJECTED_MENTOR,
  MENTORSHIP_REJECTED_PARENT,
}

export const templateSubjects = {
  [CommunicationTemplates.MENTORSHIP_REQUEST_MENTOR]:
    "[CovEd][URGENT] You’ve been requested!",
  [CommunicationTemplates.MENTORSHIP_REQUEST_PARENT]:
    "[CovEd] Mentor Request Confirmation",
  [CommunicationTemplates.MENTORSHIP_ACCEPTED_PARENT]:
    "[CovEd] Mentorship Accepted!",
  [CommunicationTemplates.MENTORSHIP_ACCEPTED_MENTOR]:
    "[CovEd] Mentorship Accepted Confirmation",
  [CommunicationTemplates.MENTORSHIP_REJECTED_MENTOR]:
    "[CovEd] Mentorship Declined Confirmation",
  [CommunicationTemplates.MENTORSHIP_REJECTED_PARENT]:
    "[CovEd] Please Request Another Mentor",
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
  [CommunicationTemplates.MENTORSHIP_REQUEST_PARENT]: (info: MessageData) => {
    const { mentor, student } = info;
    if (mentor === undefined || student === undefined) {
      throw new Error(
        "Templates::dataGenerators[MENTORSHIP_REQUEST_PARENT](): Insufficient data."
      );
    }
    return {
      mentorFirst: mentor.name,
      studentName: student.name,
    };
  },
  [CommunicationTemplates.MENTORSHIP_ACCEPTED_MENTOR]: (info: MessageData) => {
    const { parent, student } = info;
    if (parent === undefined || student === undefined) {
      throw new Error(
        "Templates::dataGenerators[MENTORSHIP_ACCEPTED_MENTOR](): Insufficient data."
      );
    }
    return {
      studentName: student.name,
      parentEmail: parent.email,
    };
  },
  [CommunicationTemplates.MENTORSHIP_ACCEPTED_PARENT]: (info: MessageData) => {
    const { mentor, student } = info;
    if (mentor === undefined || student === undefined) {
      throw new Error(
        "Templates::dataGenerators[MENTORSHIP_ACCEPTED_MENTOR](): Insufficient data."
      );
    }
    return {
      mentorFirst: mentor.name,
      studentName: student.name,
      mentorEmail: mentor.email,
    };
  },

  [CommunicationTemplates.MENTORSHIP_REJECTED_PARENT]: (info: MessageData) => {
    const { parent, student, mentor } = info;
    if (mentor === undefined || student === undefined || parent === undefined) {
      throw new Error(
        "Templates::dataGenerators[MENTORSHIP_REJECTED_PARENT](): Insufficient data."
      );
    }
    return {
      parentName: parent.name,
      mentorFirst: mentor.name,
      studentName: student.name,
    };
  },

  [CommunicationTemplates.MENTORSHIP_REJECTED_MENTOR]: (info: MessageData) => {
    const { student } = info;
    if (student === undefined) {
      throw new Error(
        "Templates::dataGenerators[MENTORSHIP_REJECTED_MENTORs](): Insufficient data."
      );
    }
    return {
      studentName: student.name,
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
      return path.join(__dirname, "templates/requestMentor.html");
    }
    case CommunicationTemplates.MENTORSHIP_REQUEST_PARENT: {
      return path.join(__dirname, "templates/requestParent.html");
    }
    case CommunicationTemplates.MENTORSHIP_ACCEPTED_MENTOR: {
      return path.join(__dirname, "templates/acceptedMentor.html");
    }
    case CommunicationTemplates.MENTORSHIP_ACCEPTED_PARENT: {
      return path.join(__dirname, "templates/acceptedParent.html");
    }
    case CommunicationTemplates.MENTORSHIP_REJECTED_MENTOR: {
      return path.join(__dirname, "templates/rejectedMentor.html");
    }
    case CommunicationTemplates.MENTORSHIP_REJECTED_PARENT: {
      return path.join(__dirname, "templates/rejectedParent.html");
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
    return `Hi ${data.mentorFirst}! Thanks for volunteering with CovEducation! ${data.parentName} has requested you as a mentor for ${data.studentName}. Please check the “Requests” tab on your dashboard in the next 48 hours to accept or decline this request. If accepting, please contact ${data.parentName} at ${data.parentEmail}. If accepting, you are agreeing to follow the Mentor Guidelines. `;
  },

  [CommunicationTemplates.MENTORSHIP_REQUEST_PARENT]: (data: {
    mentorFirst: string;
    studentName: string;
  }) => {
    return `You have successfully  requested ${data.mentorFirst} as a mentor for ${data.studentName}. If you do not hear a response via email from the mentor within 48 hours, please request another mentor. Questions? Contact coveducation@gmail.com
    `;
  },

  [CommunicationTemplates.MENTORSHIP_ACCEPTED_PARENT]: (data: {
    mentorFirst: string;
    studentName: string;
    mentorEmail: string;
  }) => {
    return `Good news! ${data.mentorFirst} has accepted your mentorship request for ${data.studentName}. If they have not already contacted you via email, you may contact them at ${data.mentorEmail}. Please reach out to coveducation@gmail.com if you have any concerns or questions!`;
  },

  [CommunicationTemplates.MENTORSHIP_ACCEPTED_MENTOR]: (data: {
    studentName: string;
    parentEmail: string;
  }) => {
    return `You have successfully accepted your mentorship for ${data.studentName}. Please be sure to contact ${data.parentEmail} to introduce yourself and decide how the mentorship will proceed. Please reach out to coveducation@gmail.com if you have any concerns or questions!`;
  },

  [CommunicationTemplates.MENTORSHIP_REJECTED_PARENT]: (data: {
    parentName: string;
    studentName: string;
    mentorFirst: string;
  }) => {
    return `Dear ${data.parentName} -- Unfortunately ${data.mentorFirst} is unable to accept your mentorship request for ${data.studentName}. If you are still in need of a mentor, please visit the Find A Mentor page to request another one. If you wish for us to find you a mentor or if you have any questions, please reach out to coveducation@gmail.com. `;
  },

  [CommunicationTemplates.MENTORSHIP_REJECTED_MENTOR]: (data: {
    studentName: string;
  }) => {
    return `This is to confirm that you have declined your mentorship for ${data.studentName}. If you no longer wish to be listed as an available mentor, please edit the availability option on your profile page on the website. Please reach out to coveducation@gmail.com if you have any concerns or questions!`;
  },
};

export default CommunicationTemplates;
