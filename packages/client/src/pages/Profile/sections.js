import React from "react";

import { Container, Grid, ListItem, List, Divider } from "@material-ui/core";

import {
  PronounsVM,
  TimezonesVM,
  SubjectsVM,
  GradeLevelsVM,
  CommunicationPreferencesVM,
  phoneRegex,
} from "../../components/SignUp2/constants";

import { useFormik } from "formik";
import * as Yup from "yup";

const SPACING = 1;

const ProfileRow = ({ label, value }) => {
  return (
    <>
      <Grid item sm={6}>
        {label}
        {": "}
      </Grid>
      <Grid item sm={6}>
        {value}{" "}
      </Grid>
    </>
  );
};

const submitSection = (onSubmit) => {
  return (values) => {
    onSubmit(values);
  };
};

export const UserDetails = ({ values, onSubmit }) => {

  const UserSchema = Yup.object({
    email: Yup.string().email().required("Email Required."),
    name: Yup.string().required("Name Required"),
    region: Yup.string().required("Region Required"),
    phone: Yup.string().matches(phoneRegex, "Phone number is not valid"),
    pronouns: Yup.string(),
    communicationPreference: Yup.string().required()
  });

  const formik = useFormik({
    initialValues: values,
    validationSchema: UserSchema,
    onSubmit: submitSection(onSubmit)
  });

  const {
    name,
    pronouns,
    email,
    phone,
    communicationPreference,
    region,
  } = formik.values;

  return (
    <Grid container spacing={SPACING}>
      <Grid item sm={12}>
        <h2>User Details</h2>
      </Grid>
      <ProfileRow label={"Name"} value={name} />
      <ProfileRow label={"Pronouns"} value={pronouns} />
      <ProfileRow label={"Email"} value={email} />
      <ProfileRow label={"Phone"} value={phone} />
      <ProfileRow
        label={"Communication Preference"}
        value={CommunicationPreferencesVM[communicationPreference]}
      />
      <ProfileRow label={"Regions"} value={TimezonesVM[region]} />
    </Grid>
  );
};

const mapJoin = (list, map) => list.map((e) => map[e]).join(", ");

export const MentorDetails = ({ values, onSubmit }) => {

  // this is duplicated code, think about moving...
  const MentorSchema = Yup.object({
    college: Yup.string(),
    gradeLevels: Yup.array().required("Grade Levels Required"),
    bio: Yup.string().required("Bio required"),
    major: Yup.string(),
    subjets: Yup.array().required("Subjects Required")
  });


  const formik = useFormik({
    initialValues: values,
    validationSchema: MentorSchema,
    onSubmit: submitSection(onSubmit)
  });

  const { college, major, bio, subjects, gradeLevels } = formik.values;

  const subjectsJoined = mapJoin(subjects, SubjectsVM);
  const gradeLevelsJoined = mapJoin(gradeLevels, GradeLevelsVM);

  return (
    <Grid container spacing={SPACING}>
      <Grid item sm={12}>
        <h2>Mentor Details</h2>
      </Grid>
      <ProfileRow label={"College"} value={college} />
      <ProfileRow label={"Major"} value={major} />
      <ProfileRow label={"Bio"} value={bio} />
      <ProfileRow label={"Subjects"} value={subjectsJoined} />
      <ProfileRow label={"Grade Levels"} value={gradeLevelsJoined} />
    </Grid>
  );
};

const StudentDetail = ({ student }) => {
  const subjects = mapJoin(student.subjects, SubjectsVM);
  return (
    <ListItem key={student.name}>
      <Grid container spacing={SPACING}>
        <ProfileRow label="Name" value={student.name} />
        <ProfileRow label="Grade level" value={student.gradeLevel} />
        <ProfileRow label="Subjects" value={subjects} />
      </Grid>
      <Divider />
    </ListItem >
  );
};

export const ParentStudentDetails = ({ values }) => {
  return (
    <Grid container spacing={SPACING}>
      <Grid item sm={12}>
        <h2>Student Details</h2>
      </Grid>
      <Grid item md={12}>
        <List>
          {values.students.map((student) => (
            <StudentDetail student={student} />
          ))}
        </List>
      </Grid>
    </Grid>
  );
};
