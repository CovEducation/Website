import React, { useState, useEffect } from "react";
import Section from '../../components/Section';
import { Link } from "react-router-dom";
import styled from "styled-components";
import Grid from '@material-ui/core/Grid';
import { FONTS, COLORS } from "../../constants";

const Wrapper = styled.div`
  p{
    font-family: ${FONTS.font2};
    font-weight: 300;
    color: ${COLORS.white};
    text-align: center;
  }
  h2 {
    font-family: ${FONTS.font1};
    font-weight: 500;
    color: ${COLORS.white};
  }
  a {
    color: ${COLORS.white}
  }
`;

const Footer = () => {
  return (
    <Wrapper>
        <Section backgroundColor='darkblue' p="50px">
          <p>
          <Grid container direction="row" justify="center" spacing={2}>
          <Grid item sm={4} xs={10}> <a target="_blank" href="https://coved.org/terms">Terms and Conditions</a></Grid>
          <Grid item sm={4} xs={10}> <a target="_blank" href="https://coved.org/privacy">Privacy Policy</a></Grid>
          <Grid item sm={4} xs={10}> <Link to="/faqs">FAQs</Link></Grid>
          </Grid>
          </p>
        </Section>
    </Wrapper>
  )
}

export default Footer;