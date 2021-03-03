import React from "react";
import { useFormik } from "formik";

import CButton from "../Button";

import {
  mentorSchema,
  CommunicationPreferences,
  Timezones,
  SharedIntialValues,
  Subjects,
  Pronouns,
} from "./constants";
import {
  Container,
  Grid,
  Button,
  ButtonGroup,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
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

const SPACING = 1;

const AccountDetails = (props) => {
  const { formik } = props;

  return (
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
    </Grid>
  );
};

const UserDetails = (props) => {
  const { formik } = props;

  return (
    <Grid container spacing={SPACING}>
      <h2> Personal Details </h2>
      <FormikField name="name" label="Name" formik={formik} xs={12} />
      <FormikSelect
        name="pronouns"
        label="Pronouns"
        values={Pronouns}
        formik={formik}
        xs={12}
      />
      <FormikField name="phone" label="Phone Number" formik={formik} xs={12} />
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
    </Grid>
  );
};

const MentorDetails = (props) => {
  const { formik } = props;

  return (
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
    </Grid>
  );
};

const StudentDetails = ({ formik }) => {
  const [numChildren, setNumChildren] = React.useState(
    formik.values.students.length
  );

  const add = () => {
    formik.values.students.push({ name: "", subjects: [] });
    setNumChildren(formik.values.students.length);
  };

  const remove = () => {
    formik.values.students.pop();
    setNumChildren(formik.values.students.length);
  };

  return (
    <div>
      <h2> Student Details </h2>
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
              />
              <FormikSelect
                name={`students[${i}].subjects`}
                label="Subjects"
                values={Subjects}
                formik={formik}
                value={formik.values.students[i].subjects}
                isMulti
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
    </div>
  );
};

const TermsConditions = (props) => {
  const { formik, back } = props;

  return (
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
      <Grid item xs={6}>
        <Button onClick={back} variant="outlined" fullWidth>
          Back
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};

const SignUpForm = ({ back }) => {
  const initialValues = { ...SharedIntialValues };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: mentorSchema,
    onSubmit: (values) => {
      console.log(values);
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <AccountDetails formik={formik} />
      <UserDetails formik={formik} />
      <MentorDetails formik={formik} />
      <StudentDetails formik={formik} />
      <TermsConditions formik={formik} back={back} />
    </form>
  );
};

const SignUp = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [userType, setUserType] = React.useState(undefined);

  const onClick = (event) => {
    setUserType(event.target.name);
    setActiveStep(1);
  };

  const back = () => {
    setUserType(null);
    setActiveStep(0);
  };

  return (
    <Container maxWidth="md">
      <Stepper activeStep={activeStep} orientation={"vertical"}>
        <Step key={"selectUserType"}>
          <StepLabel>
            <h3>Welcome to CovEd!</h3>
          </StepLabel>
          <StepContent>
            <Grid container>
              <Grid item xs={12}>
                <CButton name="Parent" theme="accent" onClick={onClick}>
                  Click here if you are a parent or teacher!
                </CButton>
              </Grid>
              <Grid item xs={12}>
                <CButton name="Mentor" onClick={onClick}>
                  Click here if you are mentor!
                </CButton>
              </Grid>
            </Grid>
          </StepContent>
        </Step>
        <Step key={"signUpForm"}>
          <StepLabel>
            <h3>Sign Up</h3>
          </StepLabel>
          <StepContent>
            <SignUpForm back={back} />
          </StepContent>
        </Step>
      </Stepper>
    </Container>
  );
};

export default SignUp;
