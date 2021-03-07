import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  CardActions,
  Button,
} from "@material-ui/core";
import React from "react";
import Jdenticon from "react-jdenticon";
import styled from "styled-components";

const ButtonBlock = styled.div`
  text-align: right;
  button {
    margin-right: 0px;
  }
  float: right;
`;
const trimIntro = (introduction) => {
  const sentenceLimit = 2;
  const sentences = introduction.split(".");
  let short = "";
  let i = 0;
  sentences.forEach((s) => {
    if (i < sentenceLimit) {
      short += s;
    }
    i += 1;
  });
  if (i < sentences.length) {
    short += "...";
  }
  return short;
};

const MentorCard = ({ mentor, onClick }) => {
  return (
    <Grid justify="space-between" item sm={4} style={{ padding: "0.5em" }}>
      <Card justify="space-between" theme="accent">
        <CardContent>
          <span>
            <Typography variant="h5" component="h2">
              {mentor.name}
            </Typography>

            <Avatar style={{ backgroundColor: "transparent" }}>
              <Jdenticon size={50} value={mentor.name} background="#fff" />
            </Avatar>
          </span>

          <Typography color="textSecondary">{mentor.region}</Typography>
          <Typography variant="body2" component="p">
            {trimIntro(mentor.introduction)}
            <br />
            <b>
              Subjects willing to mentor <br />
            </b>
            {mentor.subjects && mentor.subjects.join(", ")}
            <br />
            <b>
              Grade levels willing to mentor <br />
            </b>
            {mentor.gradeLevels && mentor.gradeLevels.join(", ")}
          </Typography>
        </CardContent>
        <CardActions>
          <ButtonBlock>
            <Button
              variant="outlined"
              color="primary"
              size="sm"
              theme="accent"
              onClick={onClick}
              disableElevation
            >
              Request Mentorship
            </Button>
          </ButtonBlock>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default MentorCard;
