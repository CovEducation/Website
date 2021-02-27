import * as Yup from 'yup'

const phoneRegex = RegExp(
    /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
);

const mentorSchema = Yup.object({
    email: Yup
        .string()
        .email()
        .required('Email Required'),
    password: Yup
        .string('Enter your password')
        .min(8, 'Password should be a minimum 8 characters length')
        .required('Password if required'),
    passwordConfirmation: Yup
        .string()
        .oneOf([Yup.ref('password'), null], 'Passwords much match'),
    name: Yup
        .string()
        .required('Name Required'),
    timezone: Yup
        .string()
        .required('Timezone Required'),
    phone: Yup
        .string()
        .matches(phoneRegex, 'Phone number is not valid'),
    pronouns: Yup
        .string(),
    college: Yup
        .string(),
    avatar: Yup
        .string()
        .required('Avatar Required'),
    bio: Yup
        .string()
        .required('Bio Required'),
    major: Yup
        .string(),
    subjects: Yup
        .array()
        .required('Subjects Required'),
    gradeLevels: Yup
        .array()
        .required('Grade Levels Required'),
    communicationPreference: Yup
        .string()
});

const SharedIntialValues = {
    email: '',
    password: '',
    name: '',
    timezone: '',
    phone: '',
    pronouns: '',
    communicationPreference: ''
}

const CommunicationPreferences = [
    { value: "EMAIL", label: "Email" },
    { value : "SMS", label: "SMS" }
]

const Pronouns = [
    { value: "he/him", label: "he/him" },
    { value: "she/her", label: "she/her" },
    { value: "they/them", label: "they/them"}
]

const Timezones = [
    { value: "HST", label: "Hawaii Time"},
    { value: "AKST", label: "Alaska Time"},
    { value: "PST", label: "Pacific Time"},
    { value: "MST", label: "Mountain Time"},
    { value: "CST", label: "Central Time"},
    { value: "EST", label: "Eastern Time"}
]

const Subjects = []
const GradeLevels = []

export { mentorSchema, CommunicationPreferences, Pronouns, Subjects, GradeLevels, Timezones, SharedIntialValues }