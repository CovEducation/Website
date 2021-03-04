import * as Yup from "yup";

const phoneRegex = RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);

const SharedInitialValues = {
  email: "",
  password: "",
  name: "",
  region: "",
  phone: "",
  pronouns: "",
  communicationPreference: "",
  subjects: [],
  gradeLevels: [],
  students: [{name: "", subjects: [], gradeLevel: ""}]
};

const CommunicationPreferences = [
  { value: "EMAIL", label: "Email" },
  { value: "SMS", label: "SMS" },
];

const Pronouns = [
  { value: "he/him", label: "he/him" },
  { value: "she/her", label: "she/her" },
  { value: "they/them", label: "they/them" },
];

const Timezones = [
  { value: "HST", label: "Hawaii Time" },
  { value: "AKST", label: "Alaska Time" },
  { value: "PST", label: "Pacific Time" },
  { value: "MST", label: "Mountain Time" },
  { value: "CST", label: "Central Time" },
  { value: "EST", label: "Eastern Time" },
];

const Subjects = [
  { value: "math", label: "Math" },
  { value: "english", label: "English" },
  { value: "science", label: "Science" },
];
const GradeLevels = [
  { value: "elementary", label: "Elementary School"},
  { value: "middle", label: "Middle School"},
  { value: "high", label: "High School" },
];

export {
  SharedInitialValues,
  CommunicationPreferences,
  Pronouns,
  Subjects,
  GradeLevels,
  Timezones,
  phoneRegex,
};
