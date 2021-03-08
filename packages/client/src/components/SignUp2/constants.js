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
  { value: "English", label: "English" },
  { value: "History", label: "History" },
  { value: "Science", label: "Science" },
  { value: "Math", label: "Math" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Biology", label: "Biology" },
  { value: "College Prep - SATs/ACTs", label: "College Prep - SATs/ACTs" },
  { value: "College Prep - Essays", label: "College Prep - Essays" },
  { value: "Writing", label: "Writing" },
  { value: "Economics", label: "Economics" },
  { value: "Studio/Visual Art", label: "Studio/Visual Art" },
  { value: "Music", label: "Music" },
  {value: "Theatre", label: "Theatre" },
  { value: "Design", label: "Design" },
  { value: "Computer Science - Python", label: "Computer Science - Python" },
  { value: "Computer Science - C/C++", label: "Computer Science - C/C++" },
  { value: "Computer Science - Java", label: "Computer Science - Java"},
  { value: "AP Physics C", label: "AP Physics C"},
  { value: "AP Calculus AB", label: "AP Calculus AB"},
  { value: "AP Calculus BC", label: "AP Calculus BC"},
  { value: "AP Statistics", label: "AP Statistics" },
  { value: "AP English Literature", label: "AP English Literature"},
  { value: "AP English Language", label: "AP English Language"},
  { value: "AP World History", label: "AP World History" },
  { value: "AP US History", label: "AP US History" },
  { value: "AP Chemistry", label: "AP Chemistry" },
  { value: "AP Biology", label: "AP Biology" },
  { value: "AP European History", label: "AP European History"},
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "Chinese", label: "Chinese" },
  { value: "German", label: "German"},
  { value: "Latin", label: "Latin"},
  { value: "Japanese", label: "Japanese"},
  { value: "Experienced in Special Education (SPED)",label: "Experienced in Special Education (SPED)" },
  { value: "English as a Second Language (ESL)", label: "English as a Second Language (ESL)"}
];
const GradeLevels = [
  { value: "Preschool", label: "Preschool" },
  { value: "Elementary School", label: "Elementary School" },
  { value: "Middle School", label: "Middle School" },
  { value: "High School", label: "High School" },
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
