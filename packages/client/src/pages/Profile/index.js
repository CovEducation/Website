import React from "react";
import styled from "styled-components";
import { MentorDetails, ParentStudentDetails, UserDetails } from "./sections";
import { MENTOR, PARENT } from "../../constants";
import { Container } from "@material-ui/core";

import useAuth from "../../providers/AuthProvider";
import CheckCircle from "@material-ui/icons/CheckCircle";
import Toast from "../../components/Toast";

import Jdenticon from "react-jdenticon";

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

const ProfilePicture = styled(Jdenticon)`
  border-radius: 50%;
  margin-right: 50px;
  border
`;



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

  const updateProfile = (values) => {
    console.log(user);
    console.log(values);

    return Promise.resolve();
  }

  const profileComponents =
    user.role === MENTOR ? MentorProfile : ParentProfile;
  return (
    <ProfilePageWrapper>
      <ProfileHeaderWrapper>
        <Jdenticon size={115} value={user.name} />
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
          <Section values={user} updateFields={updateProfile} />
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
