import React from "react";

import {
  Grid,
  ListItem,
  List,
  Divider,
  Button,
  ButtonGroup,
  IconButton,
  Menu,
  MenuItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";

import MoreVertIcon from "@material-ui/icons/MoreVert";

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

import ProfilePicture from "../../components/ProfilePicture";

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

const StudentMenu = ({ onEdit, onRemove }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit();
    handleClose();
  };

  const handleRemove = () => {
    onRemove();
    handleClose();
  };

  return (
    <div>
      <IconButton
        aria-controls="more"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="more"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem key="edit" onClick={handleEdit}>Edit</MenuItem>
        <MenuItem key="delete" onClick={handleRemove}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

const RemoveStudentConfirmation = ({
  open,
  handleDelete,
  handleClose,
  name,
}) => {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {" "}
          Are you sure you want to delete {` ${name}`} permanently?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone. Any mentorships with this student will
            be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const StudentDetail = ({
  student,
  updateStudent,
  removeStudent,
  onComplete,
  isNew,
}) => {
  const StudentSchema = Yup.object({
    name: Yup.string().required("Name required."),
    subjects: Yup.array().required(),
    gradeLevel: Yup.string().required(),
  });

  const [formEdit, setEdit] = React.useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false);

  const onCancel = () => {
    setEdit(false);
    if (onComplete !== undefined) onComplete();
    formik.resetForm({ value: student });
  };

  const onSubmit = (values) => {
    updateStudent(values)
      .then(() => setEdit(false))
      .then(() => onComplete && onComplete());
  };

  const handleDelete = () => {
    removeStudent()
      .then(() => setRemoveDialogOpen(false));
  }

  const formik = useFormik({
    initialValues: student,
    validationSchema: StudentSchema,
    onSubmit: onSubmit,
  });

  const edit = formEdit || isNew;

  const { name, gradeLevel, subjects } = formik.values;

  const subjectsJoined = mapJoin(subjects, SubjectsVM);

  return (
    <div>
      <ListItem key={student.name}>
        <ListItemAvatar>
          <ProfilePicture size={86} value={student.name} />
        </ListItemAvatar>
        <ListItemText>
          <Grid container spacing={SPACING}>
            <Grid item md={8}>
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={SPACING}>
                  <Grid item sm={12}>
                    {" "}
                    <h4>{student.name}</h4>{" "}
                  </Grid>
                  <ProfileRow
                    name="name"
                    label="Name"
                    value={name}
                    edit={edit}
                    type={Fields.TEXT}
                    formik={formik}
                  />
                  <ProfileRow
                    name="gradeLevel"
                    label="Grade Level"
                    value={gradeLevel}
                    edit={edit}
                    type={Fields.SELECT}
                    values={GradeLevels}
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
                  {edit && <SubmitButton onCancel={onCancel} />}
                </Grid>
              </form>
            </Grid>
            <Grid item md={4}>
              <StudentMenu
                onEdit={() => setEdit(true)}
                onRemove={() => setRemoveDialogOpen(true)}
              />
            </Grid>
          </Grid>
        </ListItemText>
      </ListItem>
      <Divider variant="inset" component="li" />
      <RemoveStudentConfirmation
        name={name}
        open={removeDialogOpen}
        handleClose={() => setRemoveDialogOpen(false)}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export const ParentStudentDetails = ({ values, updateFields }) => {
  const [addingStudent, setAddingStudent] = React.useState(false);
  const [students, setStudents] = React.useState(values.students);

  const addStudent = (student) => {
    values.students.push(student);
    return updateFields(values).then(setStudents([...values.students]));
  };

  const updateStudent = (i) => {
    return (student) => {
      values.students[i] = student;
      return updateFields(values).then(setStudents([...values.students]));
    };
  };

  const removeStudent = (i) => {
    return () => {
      values.students.splice(i, 1);
      return updateFields(values).then(setStudents([...values.students]));
    };
  };

  return (
    <Grid container spacing={SPACING}>
      <Grid item sm={12}>
        <h2>Student Details</h2>
      </Grid>
      <Grid item md={12}>
        <List>
          {students.map((student, i) => (
            <StudentDetail
              student={student}
              updateStudent={updateStudent(i)}
              removeStudent={removeStudent(i)}
            />
          ))}
          {addingStudent && (
            <StudentDetail
              student={{ name: "", subjects: [], gradeLevel: "" }}
              onComplete={() => setAddingStudent(false)}
              isNew={true}
              updateStudent={addStudent}
            />
          )}
        </List>
      </Grid>
      <Grid>
        {!addingStudent && (
          <Button variant="outlined" onClick={() => setAddingStudent(true)}>
            Add Student
          </Button>
        )}
      </Grid>
    </Grid>
  );
};
