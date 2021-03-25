import {
  Card,
  CardContent,
  Grid,
  Typography,
  CardActions,
  Button,
} from "@material-ui/core";
import React from "react";
import useAuth from "../../providers/AuthProvider";
import Jdenticon from "react-jdenticon";
import styled from "styled-components";
import { COLORS, FONTS } from '../../constants';

const Wrapper = styled.div`
  p {
    font-family:${FONTS.font2};
  }
  a {
    color: ${COLORS.blue};
    cursor: pointer;
  }
  a:visited {
    color: ${COLORS.darkblue};
  }
`;

const ButtonBlock = styled.div`
  text-align: right;
  button {
    margin-right: 0px;
  }
  float: right;
`;
const TitleBlock = styled.div`
  display: flex;
  flex-direction: row;

  justify-content: space-between;
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

const trimIntroChar = (introduction) => {
  const characterLimit = 250;
  const slicedIntro = introduction.slice(0,characterLimit)+"...";
  return slicedIntro;
};

const MentorCard = ({ mentor, onClick }) => {
  const { user } = useAuth();
  return (
    <Grid justify="space-between" item sm={4} style={{ padding: "0.5em" }}>
      <Card justify="space-between" theme="accent">
        <CardContent>
          <TitleBlock>
            <Typography
              variant="h5"
              component="h2"
              style={{ padding: "0.5em" }}
            >
              {mentor.name}
            </Typography>
            <Jdenticon size={50} value={mentor.name} />
          </TitleBlock>

          <Typography color="textSecondary">{mentor.region}</Typography>
          <Wrapper>
          <Typography variant="body2" component="p" align='justify'>
            {trimIntroChar(mentor.introduction)}<a onClick={onClick}><b>(See More)</b></a>
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
          </Wrapper>
        </CardContent>
        {user.role === "PARENT" && (
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
                See More
              </Button>
            </ButtonBlock>
          </CardActions>
        )}
      </Card>
    </Grid>
  );
};

export default MentorCard;
