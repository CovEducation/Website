import React, { useState } from "react";
import styled from "styled-components";
import { MentorDetails, ParentStudentDetails, UserDetails } from "./sections";
import { MENTOR, PARENT } from "../../constants";
import { Container } from "@material-ui/core";

import useAuth from "../../providers/AuthProvider";
import CheckCircle from "@material-ui/icons/CheckCircle";
import Toast from "../../components/Toast";

const SignUpChildWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: white;
  max-width: calc(700px - 4em);
  min-width: calc(400px - 4em);
  padding: 2em;
  color: black;
  button {
    width: 100%;
    margin: 0px 0px 20px 0px;
  }
`;

const ChildSignUpButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ProfilePageWrapper = styled.div`
  padding: 100px;
  h2 {
    margin: 15px 0px 10px;
  }
`;

const ProfileHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;

  p {
    margin-block-start: 10px;
    margin-block-end: 10px;
  }
`;

const ProfilePicture = styled.img`
  border-radius: 50%;
  margin-right: 50px;
`;

const ProfileDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 300px;
  gap: 20px 100px;
  p {
    margin-block-start: 10px;
    margin-block-end: 10px;
  }
`;

const StudentChildDiv = styled.div`
  display: block;
  button {
    width: 100%;
    margin: 0px 0px 20px 0px;
  }
`;

const MentorProfileDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 300px;
  gap: 5px 100px;
`;

const StudentListGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 300px;
  gap: 50px 100px;
  p {
    margin-block-start: 10px;
    margin-block-end: 10px;
  }
`;

const ButtonBlock = styled.div`
  padding: 0em 2em 2em 2em;
  button {
    width: 100%;
    margin: 0;
  }
`;

const ProfileDetailItem = ({ header, value }) => {
  let valueParsed = value;
  if (value instanceof Array) {
    valueParsed = value.join(", ");
  }

  return (
    <>
      {valueParsed && (
        <div>
          <p>
            <b>{header}</b>
          </p>
          <p>{valueParsed}</p>
        </div>
      )}
    </>
  );
};

const ProfilePage = ({ user }) => {
  const { auth } = useAuth();

  const MentorProfile = [UserDetails, MentorDetails];
  const ParentProfile = [UserDetails, ParentStudentDetails];

  const [verifiedSent, setVerifiedSent] = React.useState(false);

  const sendEmailVerification = () => {
    auth.sendEmailVerification().then(setVerifiedSent(true));
  };

  const verified = auth.emailVerified ? (
    <CheckCircle fontSize="small" />
  ) : (
    <p>
      Please Verify Your Email and refresh the page. (
      <a href="#resend" onClick={sendEmailVerification}>
        Resend Verification
      </a>
      )
    </p>
  );

  const profileComponents =
    user.role === MENTOR ? MentorProfile : ParentProfile;
  return (
    <ProfilePageWrapper>
      <ProfileHeaderWrapper>
        <ProfilePicture
          src="https://via.placeholder.com/115"
          alt="profile pic"
        />
        <div>
          <p>
            <b>{user.name}</b>
          </p>

          <p>
            {user.email} {verified}
          </p>
          <p>{user.phone}</p>
        </div>
      </ProfileHeaderWrapper>

      {profileComponents.map((Section) => (
        <Container maxWidth="md">
          <Section values={user} />
        </Container>
      ))}
      <Toast
        message={"Email Verification Sent."}
        open={verifiedSent}
        onClose={() => setVerifiedSent(false)}
      />
    </ProfilePageWrapper>
  );
};

export default ProfilePage;
