import React, { useState } from "react";
import styled from "styled-components";
import MentorRequestFrame from "./MentorRequestFrame.js";
import GridList from "@material-ui/core/GridList";
import { connectHits } from "react-instantsearch-dom";
import ModalNew from "../../components/ModalNew";
import MentorCard from "./MentorCard.js";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import useAuth from "../../providers/AuthProvider";
import Toast from "../../components/Toast/index.js";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const GridListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  overflow: hidden;
  height: 100%;
`;

const StyledGridList = styled(GridList)``;

const MentorCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 280px;
  min-width: 180px;
  margin: 0.75rem;
  cursor: pointer;
  height: 280px !important;

  img {
    border-radius: 10px;
    width: 70%;
  }
`;
const MentorCardNameText = styled.h4`
  font-size: 14px;
  margin: 15px 0px 5px;
`;
const MentorCardText = styled.p`
  font-size: 12px;
  margin-top: 0;
  margin-bottom: 5px;
`;

const MentorGrid = ({ hits }) => {
  const { sendRequestToMentor } = useAuth();
  const [toastOpen, setToastOpen] = useState(false);
  const [disable, setDisable] = useState(false);

  const [selectedMentor, setSelectedMentor] = useState({
    mentor: null,
    open: false,
  });

  const handleOpen = (mentor) => {
    setSelectedMentor({ mentor: mentor, open: true });
  };

  const handleClose = () => {
    setSelectedMentor({ open: false });
  };

  const sendRequest = async (parentID, mentorID, studentID, message) => {
    setDisable(true);
    try {
      await sendRequestToMentor(parentID, mentorID, studentID, message);
      setToastOpen(true);
      handleClose();
      setTimeout(() => {
        setToastOpen(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
    setDisable(false);
  };
  console.log(hits);
  // A grid of mentor components.
  return (
    <GridListContainer>
      <Toast open={toastOpen} message="Request Send successfully." />
      <StyledGridList cellHeight={180} cols={3}>
        {hits.map((mentor) => {
          if (mentor === null || mentor === undefined) {
            return <></>;
          }
          return (
            <MentorCardContainer key={mentor.objectID}>
              <img
                src={
                  mentor.avatar || `${process.env.PUBLIC_URL}/stock-profile.png`
                }
                alt="profile pic"
                onClick={() => handleOpen(mentor)}
              />
              <MentorCardNameText>{mentor.name}</MentorCardNameText>
              <MentorCardText>{mentor.timezone}</MentorCardText>
              {mentor.subjects && mentor.subjects.length > 0 && (
                <MentorCardText>{mentor.subjects.join(", ")}</MentorCardText>
              )}
              {mentor.gradeLevels && mentor.gradeLevels.length > 0 && (
                <MentorCardText>{mentor.gradeLevels.join(", ")}</MentorCardText>
              )}
            </MentorCardContainer>
          );
        })}
      </StyledGridList>
      <ModalNew
        title={(selectedMentor.mentor && selectedMentor.mentor.name) || ""}
        open={selectedMentor.open}
        handleClose={handleClose}
        trigger={<></>}
      >
        <MentorRequestFrame
          mentor={selectedMentor.mentor}
          onSendRequest={sendRequest}
          disable={disable}
        />
      </ModalNew>
    </GridListContainer>
  );
};

const MentorHits = connectHits(MentorGrid);

export default MentorHits;
