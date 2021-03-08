import React from 'react';
import { FONTS } from '../../constants';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';


const Wrapper = styled.div`
  text-align: center;
  span {
    font-size: 20px;
    font-weight: 500;
    font-style: normal;
    line-height: 48px;
    font-family:${FONTS.font2};
  }
`;
const Title = styled.h1`
  padding-top: 50px;
  font-size: max(1.5vw, 32px);
  font-weight: 900;
  font-family: ${FONTS.font2};
  left: calc(50% - 267px/2 + 0.5px)
  top: 86px
`;

const Subtitle = styled.p`
  font-size: max(1.1vw, 20px);
  font-weight: 500;
  font-style: normal;
  font-family:${FONTS.font2};
`;

const Body = styled.div`
    font-family: ${FONTS.font2};
    font-style: normal;
    font-weight: normal;
    font-size: max(1vw, 16px);
    line-height: 27px;
    display: flex;
    font-feature-settings: 'pnum' on, 'lnum' on;
    padding-bottom: 3%;
`;



const TermsPage = () => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <Title>hi</Title>
    </Wrapper>
  )
}

export default TermsPage;