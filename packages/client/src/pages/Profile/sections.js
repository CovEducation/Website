import React from "react";

import {
  Grid,
  ListItem,
  List,
  Divider,
  Button,
  ButtonGroup,
} from "@material-ui/core";

import {
  Timezones,
  Subjects,
  GradeLevels,
  CommunicationPreferences,
  availabilities,
  TimezonesVM,
  SubjectsVM,
  GradeLevelsVM,
  CommunicationPreferencesVM,
  availabilitiesVM,
  phoneRegex,
} from "../../components/SignUp2/constants";

import {
  FormikField,
  FormikSelect,
  FormikRadio,
} from "../../components/SignUp2/fields";

import { useFormik } from "formik";
import * as Yup from "yup";

const SPACING = 1;

const Fields = {
  TEXT: "text",
  SELECT: "select",
  RADIO: "radio",
  FIELD: "field",
  CHECKBOX: "checkbox",
};

const ProfileRow = ({
  name,
  label,
  value,
  edit,
  type,
  multiline,
  formik,
  values,
  isMulti,
}) => {
  if (!edit) type = Fields.FIELD; // display default view

  switch (type) {
    case Fields.TEXT:
      return (
        <FormikField
          name={name}
          label={label}
          formik={formik}
          xs={12}
          multiline={multiline}
        />
      );

    case Fields.SELECT:
      return (
        <FormikSelect
          name={name}
          label={label}
          values={values}
          formik={formik}
          isMulti={isMulti}
          xs={12}
        />
      );

    case Fields.RADIO:
      return (
        <FormikRadio
          name={name}
          value={value}
          label={label}
          values={values}
          formik={formik}
          xs={12}
        />
      );

    default:
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
  }
};

const EditButton = ({ onClick }) => {
  return (
    <h2>
      <Button variant="outlined" onClick={onClick}>
        Edit
      </Button>
    </h2>
  );
};

const SubmitButton = ({ onSubmit, onCancel }) => {
  return (
    <Grid item xs={12}>
      <ButtonGroup>
        <Button type="reset" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" onClick={onSubmit}>
          Submit
        </Button>
      </ButtonGroup>
    </Grid>
  );
};

const submitSection = (onSubmit) => {
  // This validation should be moved somewhere else.

  return (values) => {
    onSubmit({ ...values, available: values.available === "YES" });
  };
};

export const UserDetails = ({ values, updateFields }) => {
  const UserSchema = Yup.object({
    email: Yup.string().email().required("Email Required."),
    name: Yup.string().required("Name Required"),
    region: Yup.string().required("Region Required"),
    phone: Yup.string().matches(phoneRegex, "Phone number is not valid"),
    pronouns: Yup.string(),
    communicationPreference: Yup.string().required(),
  });

  const onCancel = () => {
    setEdit(false);
    // reset the form fields to their previous values
    formik.resetForm({ values: values });
  };

  const onSubmit = (values) => {
    updateFields(values).then(() => setEdit(false));
  };
  const formik = useFormik({
    initialValues: values,
    validationSchema: UserSchema,
    onSubmit: submitSection(onSubmit),
  });

  const [edit, setEdit] = React.useState(false);

  const {
    name,
    pronouns,
    email,
    phone,
    communicationPreference,
    region,
  } = formik.values;

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={SPACING}>
        <Grid item sm={6}>
          <h2>User Details</h2>
        </Grid>
        {!edit && (
          <Grid item sm={6}>
            <EditButton onClick={() => setEdit(true)} />
          </Grid>
        )}
        <ProfileRow
          name="name"
          label="Name"
          value={name}
          edit={edit}
          type={Fields.TEXT}
          formik={formik}
        />
        <ProfileRow
          name="pronouns"
          label="Pronouns"
          value={pronouns}
          edit={edit}
          type={Fields.TEXT}
          formik={formik}
        />
        <ProfileRow
          name="email"
          label="Email"
          value={email}
          edit={edit}
          type={Fields.TEXT}
          formik={formik}
        />
        <ProfileRow
          name="phone"
          label="Phone"
          value={phone}
          edit={edit}
          type={Fields.TEXT}
          formik={formik}
        />
        <ProfileRow
          name="communicationPreference"
          label="Communication Preference"
          value={CommunicationPreferencesVM[communicationPreference]}
          edit={edit}
          type={Fields.RADIO}
          values={CommunicationPreferences}
          formik={formik}
        />
        <ProfileRow
          name="region"
          label="Region"
          value={TimezonesVM[region]}
          edit={edit}
          type={Fields.SELECT}
          values={Timezones}
          formik={formik}
        />
        {edit && <SubmitButton onCancel={onCancel} />}
      </Grid>
    </form>
  );
};

const mapJoin = (list, map) => list.map((e) => map[e]).join(", ");

export const MentorDetails = ({ values, updateFields }) => {
  values.available =
    values.available === true || values.available === "YES" ? "YES" : "NO";
  // this is duplicated code, think about moving...
  const MentorSchema = Yup.object({
    college: Yup.string(),
    gradeLevels: Yup.array().required("Grade Levels Required"),
    introduction: Yup.string().required("Bio required"),
    major: Yup.string(),
    subjects: Yup.array().required("Subjects Required"),
    available: Yup.string().default(values.available),
  });

  const onCancel = () => {
    setEdit(false);
    // reset the form fields to their previous values
    formik.resetForm({ values: values });
  };

  const onSubmit = (values) => {
    updateFields(values).then(() => setEdit(false));
  };

  const formik = useFormik({
    initialValues: values,
    validationSchema: MentorSchema,
    onSubmit: submitSection(onSubmit),
  });

  const [edit, setEdit] = React.useState(false);

  const {
    college,
    major,
    introduction,
    subjects,
    gradeLevels,
    available,
  } = formik.values;

  const subjectsJoined = mapJoin(subjects, SubjectsVM);
  const gradeLevelsJoined = mapJoin(gradeLevels, GradeLevelsVM);
  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={SPACING}>
        <Grid item sm={6}>
          <h2>Mentor Details</h2>
        </Grid>
        {!edit && (
          <Grid item sm={6}>
            <EditButton onClick={() => setEdit(true)} />
          </Grid>
        )}
        <ProfileRow
          name="college"
          label="College"
          value={college}
          edit={edit}
          type={Fields.TEXT}
          formik={formik}
        />
        <ProfileRow
          name="major"
          label="Major"
          value={major}
          edit={edit}
          type={Fields.TEXT}
          formik={formik}
        />
        <ProfileRow
          name="introduction"
          label="Introduction"
          value={introduction}
          edit={edit}
          type={Fields.TEXT}
          multiline
          formik={formik}
        />
        <ProfileRow
          name="subjects"
          label="Subjects"
          value={subjectsJoined}
          edit={edit}
          type={Fields.SELECT}
          values={Subjects}
          isMulti
          formik={formik}
        />
        <ProfileRow
          name="gradeLevels"
          label="Grade Levels"
          value={gradeLevelsJoined}
          edit={edit}
          type={Fields.SELECT}
          values={GradeLevels}
          isMulti
          formik={formik}
        />
        <ProfileRow
          name="available"
          label="Available to Mentor"
          value={availabilitiesVM[available]}
          edit={edit}
          type={Fields.RADIO}
          values={availabilities}
          formik={formik}
        />
        {edit && <SubmitButton onCancel={onCancel} />}
      </Grid>
    </form>
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
    </ListItem>
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
