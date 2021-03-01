import React from "react";
import { useFormik } from "formik";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

import {
  mentorSchema,
  CommunicationPreferences,
  Timezones,
  SharedIntialValues,
} from "./constants";

const FormikField = (props) => {
  const { name, label, formik, type, select, values } = props;

  return (
    <TextField
      fullWidth
      id={name}
      name={name}
      label={label}
      type={type}
      onChange={formik.handleChange}
      value={formik.values[name]}
      error={formik.touched[name] && Boolean(formik.errors[name])}
      helperText={formik.touched[name] && formik.errors[name]}
      variant="outlined"
      margin="dense"
      select={select}
    >
      {select ? (
        values.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))
      ) : (
        <></>
      )}
    </TextField>
  );
};

const AccountDetails = (props) => {
  const { formik } = props;

  return (
    <div>
      <h2> Account Details </h2>
      <FormikField name="email" label="Email" formik={formik} />
      <FormikField
        name="password"
        label="Password"
        formik={formik}
        type="pasword"
      />
      <FormikField
        name="email"
        label="Password Confirmation"
        formik={formik}
        type="password"
      />
    </div>
  );
};

const UserDetails = (props) => {
  const { formik } = props;

  return (
    <div>
      <h2> Personal Details </h2>
      <FormikField name="name" label="Name" formik={formik} />
      <FormikField name="pronouns" label="Pronouns" formik={formik} />
      <FormikField name="phone" label="Phone Number" formik={formik} />
      <FormikField
        name="timezone"
        label="Timezone"
        select
        values={Timezones}
        formik={formik}
      />
      <FormikField
        name="communicationPreference"
        label="Communication Preference"
        select
        values={CommunicationPreferences}
        formik={formik}
      />
    </div>
  );
};

const SignUp = () => {
  const initialValues = { ...SharedIntialValues };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: mentorSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <AccountDetails formik={formik} />
        <UserDetails formik={formik} />
        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default SignUp;
