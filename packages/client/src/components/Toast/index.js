import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

export default function Toast(props) {
  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      open={props.open}
      autoHideDuration={2000}
      onClose={props.onClose}
    >
      <Alert severity={props.status || "success"}>
        {props.message || "This is a success message!"}
      </Alert>
    </Snackbar>
  );
}
