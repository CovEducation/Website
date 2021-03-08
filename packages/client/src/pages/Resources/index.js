import React from "react";
import styled from "styled-components";
import { FONTS } from "../../constants";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";

const Wrapper = styled.div`
  text-align: center;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  font-size: 4em;
  overflow: hidden;
  p {
    font-family: ${FONTS.font2};
  }
  h2 {
    font-family: ${FONTS.font1};
    font-weight: 500;
    padding-top: 30px;
  }
`;

const ResourcesPage = () => {
  return (
    <Wrapper>
      <Alert severity="warning">
        <AlertTitle>Resources</AlertTitle>
        Coming Soon! In the coming week, we'll be adding some useful links as
        well as several handbooks and helpful fliers put together by the CovEd
        team!
      </Alert>
    </Wrapper>
  );
};

export default ResourcesPage;
