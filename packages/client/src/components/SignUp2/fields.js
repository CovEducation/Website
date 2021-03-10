import React from "react";

import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import { FormHelperText, Grid } from "@material-ui/core";

const FormikField = (props) => {
  const {
    name,
    label,
    formik,
    type,
    select,
    values,
    multiline,
    xs,
    rows,
    validationFunc,
  } = props;

  let value, error, helperText;
  if (!validationFunc) {
    value = formik.values[name];
    error = formik.touched[name] && Boolean(formik.errors[name]);
    helperText = formik.touched[name] && formik.errors[name];
  } else {
    [value, error, helperText] = validationFunc(formik);
  }

  return (
    <Grid item sm={xs}>
      <FormControl component="fieldset" fullWidth>
        <TextField
          fullWidth
          id={name}
          name={name}
          label={label}
          type={type}
          onChange={formik.handleChange}
          value={value}
          error={error}
          helperText={helperText}
          variant="filled"
          select={select}
          rows={rows}
          multiline={multiline}
          size="small"
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
      </FormControl>
    </Grid>
  );
};

const FormikRadio = (props) => {
  const { name, label, formik, values, xs } = props;

  return (
    <Grid item xs={xs}>
      <FormControl component="fieldset">
        <FormLabel component="legend"> {label} </FormLabel>
        <RadioGroup
          row
          aria-label={name}
          name={name}
          value={formik.values[name]}
          onChange={formik.handleChange}
        >
          {values.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Grid>
  );
};

const FormikSelect = (props) => {
  const { name, label, formik, values, isMulti, xs, validationFunc } = props;

  let value, error, helperText;
  if (!validationFunc) {
    value = formik.values[name];
    error = formik.touched[name] && Boolean(formik.errors[name]);
    helperText = formik.touched[name] && formik.errors[name];
  } else {
    [value, error, helperText] = validationFunc(formik);
  }
  return (
    <Grid item sm={xs}>
      <FormControl variant="filled" fullWidth error={error}>
        <InputLabel id={name}> {label} </InputLabel>
        <Select
          labelId={name}
          name={name}
          multiple={isMulti}
          value={value}
          onChange={formik.handleChange}
          size="small"
        >
          {values.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText> {helperText} </FormHelperText>}
      </FormControl>
    </Grid>
  );
};

const FormikCheckbox = (props) => {
  const { name, label, formik, xs } = props;

  return (
    <Grid item xs={xs}>
      <FormControlLabel
        control={
          <Checkbox
            checked={formik.values[name]}
            onChange={formik.handleChange}
            name={name}
            color="primary"
          />
        }
        label={label}
      />
    </Grid>
  );
};

export { FormikField, FormikRadio, FormikSelect, FormikCheckbox };
