import React from "react";

import { Container, Grid } from "@material-ui/core";

import {
  PronounsVM,
  TimezonesVM,
  SubjectsVM,
  GradeLevelsVM,
  CommunicationPreferencesVM,
} from "../../components/SignUp2/constants";

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

export const UserDetails = ({ values }) => {
  const {
    name,
    pronouns,
    email,
    phone,
    communicationPreference,
    region,
  } = values;

  return (
    <Grid container spacing={SPACING}>
      <Grid item sm={12}><h2>User Details</h2></Grid>
      <ProfileRow label={"Name"} value={name} />
      <ProfileRow label={"Pronouns"} value={PronounsVM[pronouns]} />
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

export const MentorDetails = ({ values }) => {
  const { college, major, bio, subjects, gradeLevels } = values;

  //   const subjectsJoined = subjects.map(sub => SubjectsVM[sub]).join(", ");
  const gradeLevelsJoined = gradeLevels
    .map((gl) => GradeLevelsVM[gl])
    .join(", ");

  return (
    <Grid container spacing={SPACING}>
      <Grid item sm={12}><h2>Mentor Details</h2></Grid>
      <ProfileRow label={"College"} value={college} />
      <ProfileRow label={"Major"} value={major} />
      <ProfileRow label={"Bio"} value={bio} />
      {/* <ProfileRow label={"Subjects"} value={subjectsJoined} /> */}
      <ProfileRow label={"Grade Levels"} value={gradeLevelsJoined} />
    </Grid>
  );
};

export const StudentDetails = ({ values }) => {
  const { students } = values;
};
