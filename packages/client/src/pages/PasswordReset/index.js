import { Button, Grid, Container } from "@material-ui/core";
import { AttachFileSharp } from "@material-ui/icons";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";

import { FormikField } from "../../components/SignUp2/fields";
import Toast from "../../components/Toast";
import { Auth } from "../../providers/FirebaseProvider";

const ResetPasswordSchema = Yup.object({
    email: Yup.string().email().required("Please input a valid email.")
});

const ResetPassword = () => {
    const [ formMessage, setFormMesssage ] = React.useState({open: false, msg: ""});

    const handleSubmit = (values) => {
        Auth.sendPasswordResetEmail(values.email)
            .then(() => setFormMesssage({open: true, msg: "Password Reset Sent", severity: "success"}))
            .catch((err) => setFormMesssage({open: true, msg: err.message, severity: "error"}));
    };

    const formik = useFormik({
        initialValues: { email: "" },
        validationSchema: ResetPasswordSchema,
        onSubmit: handleSubmit
    });

    return (
        <Container component="form" maxWidth="xs" onSubmit={formik.handleSubmit}>
            <h1>Reset Password</h1>
            <p>Please enter the email you used to register with CovEd. We will email you instructions to reset your password.</p>
            <Grid container spacing={1}>
                <FormikField name="email" label="email" formik={formik} xs={12} />
                <Grid item sm={12}><Button variant="contained" color="primary" disableElevation type="submit">Submit</Button></Grid>
            </Grid>
            <Toast
                message={formMessage.msg}
                open={formMessage.open}
                onClose={() => setFormMesssage({open: false, msg: ""})}
                status={formMessage.severity}
            />
        </Container>
    )
}


export default ResetPassword;