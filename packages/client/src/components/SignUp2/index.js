import React from "react";

import CButton from "../Button";

import {
  Button,
  Container,
  Grid,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@material-ui/core";
import {
  AccountDetails,
  UserDetails,
  MentorDetails,
  StudentDetails,
  TermsConditions,
} from "./sections";

import { SharedInitialValues } from "./constants";

import useAuth from "../../providers/AuthProvider";

const SignUp = () => {
  const { signup } = useAuth();

  const [activeStep, setActiveStep] = React.useState(0);
  const [userType, setUserType] = React.useState(undefined);

  const [formSections, setForm] = React.useState([]);
  const [formData, setFormData] = React.useState({ ...SharedInitialValues });

  const MentorForm = [
    { label: "Account Details", Form: AccountDetails },
    { label: "Personal Details", Form: UserDetails },
    { label: "Mentor Details", Form: MentorDetails },
    { label: "Terms and Conditions", Form: TermsConditions },
  ];

  const ParentForm = [
    { label: "Account Details", Form: AccountDetails },
    { label: "Personal Details", Form: UserDetails },
    { label: "Student Details", Form: StudentDetails },
    { label: "Terms and Conditions", Form: TermsConditions },
  ];

  const formSteps = {
    Mentor: MentorForm,
    Parent: ParentForm,
  };

  const selectUserType = (event) => {
    setUserType(event.target.name);
    setForm(formSteps[event.target.name]);
    setActiveStep(1);
  };

  const onNext = (values) => {
    setFormData(Object.assign(formData, values));
    if (activeStep === formSteps[userType].length) {
      formData.role = userType.toUpperCase();
      signup(formData.email, formData.password, formData)
        .then((res) => {
          setActiveStep(activeStep + 1);
        })
        .catch((err) => console.log(err));
    }
    setActiveStep(activeStep + 1);
  };

  const back = () => {
    setActiveStep(activeStep - 1);
    if (activeStep - 1 == 0) {
      setUserType(null);
      setForm([]);
    }
  };

  const stepperControls = (
    <>
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
    </>
  );

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
                <CButton name="Parent" theme="accent" onClick={selectUserType}>
                  Click here if you are a parent or teacher!
                </CButton>
              </Grid>
              <Grid item xs={12}>
                <CButton
                  name="Mentor"
                  onClick={selectUserType}
                  intialValues={formData}
                >
                  Click here if you are mentor!
                </CButton>
              </Grid>
            </Grid>
          </StepContent>
        </Step>

        {formSections.map(({ label, Form }) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Form
                onSubmit={onNext}
                stepperControls={stepperControls}
                initialValues={formData}
              />
            </StepContent>
          </Step>
        ))}
        {formSections.length > 0 && (
          <Step key="submitting">
            <StepLabel>Submitting</StepLabel>
            <StepContent>
              <LinearProgress />
            </StepContent>
          </Step>
        )}
      </Stepper>
    </Container>
  );
};

export default SignUp;
