import React from "react";
import HTabs from "./Tabs";
import styled from "styled-components";
import { FONTS } from '../../constants';

import { getTeamDataList } from "../../api";

const TabsContainer = styled.div`
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  text-align: center;
  width: 70%;
  margin: 0 auto;
  h2 {
    font-family: ${FONTS.font1};
    font-weight: 500;
    padding-top: 20px;
  }
  p{
    font-family: ${FONTS.font2};
  }
`;
const MeetOurTeam = () => {
  const [teamData, setTeamData] = React.useState([]);

  React.useEffect(() => {
    getTeamDataList()
      .then((data) => {
        setTeamData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getFilteredData = (category) => {
    if (category !== undefined) {
      const data = teamData && teamData.filter((data) => data.team.includes(category));
      return data;
    } else {
      return teamData;
    }
  };
  return (
    <div>
      <TabsContainer>
      <h2> Meet Our Team </h2>
        <HTabs
          texts={[
            getFilteredData(), // All
            getFilteredData("Management"),
            getFilteredData("Coordinators"),
            getFilteredData("Public Relations"),
            getFilteredData("Outreach"),
            getFilteredData("Speaker Series"),
            getFilteredData("Technology"),
          ]}
          labels={[
            "All",
            "Management",
            "Coordinators",
            "Public Relations",
            "Outreach",
            "Speaker Series",
            "Technology Team",
          ]}
          class="process"
        />
      </TabsContainer>
    </div>
  );
};

export default MeetOurTeam;
