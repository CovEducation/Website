import CommunicationPreference from "src/models/CommunicationPreference";

export enum CommunicationTemplates {
  WELCOME,
  MENTORSHIP_REQUEST_PARENT,
  MENTORSHIP_REQUEST_MENTOR,
  MENTORSHIP_ACCEPTANCE_PARENT,
  MENTORSHIP_ACCEPTANCE_MENTOR,
  MENTORSHIP_REJECTION_PARENT,
  MENTORSHIP_REJECTION_MENTOR,
}

const generateTemplate = (
  _template: CommunicationTemplates,
  _method: CommunicationPreference
) => {};

export default generateTemplate;
