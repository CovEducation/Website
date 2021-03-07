import React from "react";

import {
  Grid,
  Button,
  ButtonGroup,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import {
  FormikField,
  FormikRadio,
  FormikSelect,
  FormikCheckbox,
} from "./fields";

import {
  CommunicationPreferences,
  Timezones,
  phoneRegex,
  Subjects,
  Pronouns,
  GradeLevels,
} from "./constants";

import * as Yup from "yup";
import { useFormik } from "formik";

const SPACING = 1;

const submitSection = (onSubmit) => {
  return (values) => {
    onSubmit(values);
  };
};

const AccountDetails = (props) => {
  const { onSubmit, stepperControls, initialValues } = props;

  const AccountSchema = Yup.object({
    email: Yup.string().email().required("Email Required"),
    password: Yup.string("Enter your password")
      .min(8, "Password should be a minimum 8 characters length")
      .required("Password Required"),
    passwordConfirmation: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords much match"
    ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: AccountSchema,
    onSubmit: submitSection(onSubmit),
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={SPACING}>
        <h2> Account Details </h2>
        <FormikField name="email" label="Email" formik={formik} xs={12} />
        <FormikField
          name="password"
          label="Password"
          formik={formik}
          type="password"
          xs={6}
        />
        <FormikField
          name="passwordConfirmation"
          label="Confirm Password"
          formik={formik}
          type="password"
          xs={6}
        />
        {stepperControls}
      </Grid>
    </form>
  );
};

const UserDetails = (props) => {
  const { onSubmit, stepperControls, initialValues } = props;

  const UserSchema = Yup.object({
    name: Yup.string().required("Name Required"),
    region: Yup.string().required("Region Required"),
    phone: Yup.string().matches(phoneRegex, "Phone number is not valid"),
    pronouns: Yup.string(),
    communicationPreference: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: UserSchema,
    onSubmit: submitSection(onSubmit),
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={SPACING}>
        <h2> Personal Details </h2>
        <FormikField name="name" label="Name" formik={formik} xs={12} />
        <FormikField name="pronouns" label="Pronouns" formik={formik} xs={12} />
        <FormikField
          name="phone"
          label="Phone Number"
          formik={formik}
          xs={12}
        />
        <FormikSelect
          name="region"
          label="Region"
          values={Timezones}
          formik={formik}
          xs={12}
        />

        <FormikRadio
          name="communicationPreference"
          label="Communication Preference"
          values={CommunicationPreferences}
          formik={formik}
          xs={12}
        />
        {stepperControls}
      </Grid>
    </form>
  );
};

const MentorDetails = (props) => {
  const { onSubmit, stepperControls, initialValues } = props;

  const MentorSchema = Yup.object({
    college: Yup.string(),
    // avatar: Yup.string().required("Avatar Required"),
    gradeLevels: Yup.array().required("Grade Levels Required"),
    bio: Yup.string().required("Bio Required"),
    major: Yup.string(),
    subjects: Yup.array().required("Subjects Required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: MentorSchema,
    onSubmit: submitSection(onSubmit),
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={SPACING}>
        <h2> Mentor Profile </h2>
        <FormikField name="college" label="College" formik={formik} xs={12} />
        <FormikField name="major" label="Major" formik={formik} xs={12} />
        <FormikField
          name="bio"
          label="Tell us a little about yourself."
          multiline
          formik={formik}
          xs={12}
          rows={4}
        />
        <FormikSelect
          name="subjects"
          label="Subjects"
          values={Subjects}
          formik={formik}
          isMulti
          xs={12}
        />
        <FormikSelect
          name="gradeLevels"
          label="Grade Level"
          values={GradeLevels}
          formik={formik}
          isMulti
          xs={12}
        />
        {stepperControls}
      </Grid>
    </form>
  );
};

const TermsConditions = (props) => {
  const { onSubmit, stepperControls, initialValues } = props;

  const TermsSchema = Yup.object({
    termsOfService: Yup.bool().oneOf([true], "Must accept Terms of Service"),
    privacyPolicy: Yup.bool().oneOf([true], "Must accept Privacy Policy"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: TermsSchema,
    onSubmit: submitSection(onSubmit),
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={SPACING}>
        <FormikCheckbox
          name="termsOfService"
          label="I agree to the CovEd Terms of Service."
          formik={formik}
          xs={12}
        />
        <FormikCheckbox
          name="privacyPolicy"
          label="I agree to the CovEd Privacy Policy."
          formik={formik}
          xs={12}
        />
        {stepperControls}
      </Grid>
    </form>
  );
};

const StudentDetails = (props) => {
  const { onSubmit, stepperControls, initialValues } = props;

  const StudentsSchema = Yup.object({
    students: Yup.array()
      .of(
        Yup.object({
          name: Yup.string().required("Name required."),
          subjects: Yup.array().required(),
          gradeLevel: Yup.string().required(),
        })
      )
      .min(1, "Must have at least one student"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: StudentsSchema,
    onSubmit: submitSection(onSubmit),
  });

  const [numChildren, setNumChildren] = React.useState(
    formik.values.students.length
  );

  const add = () => {
    formik.values.students.push({ name: "", subjects: [] });
    setNumChildren(formik.values.students.length);
  };

  const remove = () => {
    // there must be at least one student: maybe we should give a warning when trying to remove last student
    if (numChildren == 1) return;

    formik.values.students.pop();
    setNumChildren(formik.values.students.length);
  };

  const validationFunc = (i, field) => {
    return (f) => {
      return [
        f.values.students[i][field],
        f.touched.students &&
          f.touched.students[i] &&
          f.touched.students[i][field] &&
          f.errors.students &&
          f.errors.students[i] &&
          Boolean(f.errors.students[i][field]),
        f.touched.students &&
          f.touched.students[i] &&
          f.touched.students[i][field] &&
          f.errors.students &&
          f.errors.students[i] &&
          f.errors.students[i][field],
      ];
    };
  };

  return (
    <div>
      <h2> Student Details </h2>
      <form onSubmit={formik.handleSubmit}>
        <List>
          {[...Array(numChildren).keys()].map((i) => (
            <ListItem>
              <Grid container spacing={SPACING}>
                <Grid item xs={12}>
                  {`Student ${i + 1}`}
                </Grid>
                <FormikField
                  name={`students[${i}].name`}
                  label="Name"
                  formik={formik}
                  xs={12}
                  validationFunc={validationFunc(i, "name")}
                />
                <FormikSelect
                  name={`students[${i}].subjects`}
                  label="Subjects"
                  values={Subjects}
                  formik={formik}
                  validationFunc={validationFunc(i, "subjects")}
                  isMulti
                  xs={12}
                />
                <FormikSelect
                  name={`students[${i}].gradeLevel`}
                  label="Grade Level"
                  values={GradeLevels}
                  formik={formik}
                  validationFunc={validationFunc(i, "gradeLevel")}
                  xs={12}
                />
                <Divider />
              </Grid>
            </ListItem>
          ))}
          <ListItem>
            <ButtonGroup>
              <Button onClick={add}> Add Student</Button>
              <Button onClick={remove}> Remove Student </Button>
            </ButtonGroup>
          </ListItem>
        </List>
        <Grid container spacing={SPACING}>
          {stepperControls}
        </Grid>
      </form>
    </div>
  );
};

export {
  AccountDetails,
  UserDetails,
  MentorDetails,
  StudentDetails,
  TermsConditions,
};
