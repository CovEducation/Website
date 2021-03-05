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
  students: [{ name: "", subjects: [], gradeLevel: "" }],
};

// this helper function will tranform the option lists into a mapping from value to label
// useful for displaying fields back to the user.
// Note: if this could be done at compile that would be great.
const transformValueMap = (optionList) => {
  const valueMap = {};

  optionList.forEach((option) => {
    valueMap[option.value] = option.label;
  });

  return valueMap;
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
  { value: "elementary", label: "Elementary School" },
  { value: "middle", label: "Middle School" },
  { value: "high", label: "High School" },
];

const CommunicationPreferencesVM = transformValueMap(CommunicationPreferences);
const PronounsVM = transformValueMap(Pronouns);
const TimezonesVM = transformValueMap(Timezones);
const SubjectsVM = transformValueMap(Subjects);
const GradeLevelsVM = transformValueMap(GradeLevels);

export {
  SharedInitialValues,
  CommunicationPreferences,
  Pronouns,
  Subjects,
  GradeLevels,
  Timezones,
  phoneRegex,
  CommunicationPreferencesVM,
  PronounsVM,
  TimezonesVM,
  SubjectsVM,
  GradeLevelsVM,
};
