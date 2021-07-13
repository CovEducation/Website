import React from "react";
import styled from "styled-components";
import { MentorDetails, ParentStudentDetails, UserDetails } from "./sections";
import { MENTOR } from "../../constants";
import { Container } from "@material-ui/core";
import { saveProfileData } from "../../api";
import useAuth from "../../providers/AuthProvider";
import CheckCircle from "@material-ui/icons/CheckCircle";
import Toast from "../../components/Toast";

import ProfilePicture from "../../components/ProfilePicture";

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

const ProfilePage = ({ user }) => {
  const { auth } = useAuth();

  const MentorProfile = [UserDetails, MentorDetails];
  const ParentProfile = [UserDetails, ParentStudentDetails];

  const [profileToast, setProfileToast] = React.useState({
    message: "",
    open: false,
  });

  const sendEmailVerification = () => {
    auth
      .sendEmailVerification()
      .then(() =>
        setProfileToast({ message: "Email Verification Sent.", open: true })
      );
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
    return saveProfileData(user.uid, values).then((data) => {
      setProfileToast({ message: "Update Successful.", open: true });
      return data;
    });
  };

  const profileComponents =
    user.role === MENTOR ? MentorProfile : ParentProfile;
  return (
    <ProfilePageWrapper>
      <ProfileHeaderWrapper>
        <ProfilePicture size={112} value={user.name} />
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
        message={profileToast.message}
        open={profileToast.open}
        onClose={() => setProfileToast({ message: "", open: false })}
      />
    </ProfilePageWrapper>
  );
};

export default ProfilePage;
