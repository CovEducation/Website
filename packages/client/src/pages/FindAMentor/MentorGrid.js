import React, { useState } from "react";
import styled from "styled-components";
import MentorRequestFrame from "./MentorRequestFrame.js";
import GridList from "@material-ui/core/GridList";
import { connectHits } from "react-instantsearch-dom";
import ModalNew from "../../components/ModalNew";
import Toast from "../../components/Toast/index.js";

import MentorCard from "./MentorCard";

import { sendRequest } from "../../api";
import { Container, Grid } from "@material-ui/core";

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

  const onRequest = async (parentID, mentorID, studentID, message) => {
    setDisable(true);
    try {
      await sendRequest(parentID, mentorID, studentID, message);
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
  // A grid of mentor components.
  return (
    <Container>
      <Toast open={toastOpen} message="Request Send successfully." />
      <Grid container spacing={1}>
        {hits.map((mentor) => {
          if (mentor === null || mentor === undefined) {
            return <></>;
          }
          return (
            <MentorCard mentor={mentor} />
          );
        })}
      </Grid>
      <ModalNew
        title={(selectedMentor.mentor && selectedMentor.mentor.name) || ""}
        open={selectedMentor.open}
        handleClose={handleClose}
        trigger={<></>}
      >
        <MentorRequestFrame
          mentor={selectedMentor.mentor}
          onSendRequest={onRequest}
          disable={disable}
        />
      </ModalNew>
    </Container >
  );
};

const MentorHits = connectHits(MentorGrid);

export default MentorHits;
