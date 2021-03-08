import React from 'react';
import styled from 'styled-components';
import { FONTS } from '../../constants';
import Section from '../../components/Section';

const Wrapper = styled.div`
  text-align: center;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  p{
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
      <Section p="100px">
        <h2> Resources </h2>
        Coming Soon! In the coming week, we'll be adding some useful links as well as several handbooks and helpful fliers put together by the CovEd team! 
      </Section>
    </Wrapper>
  )
}

export default ResourcesPage;
