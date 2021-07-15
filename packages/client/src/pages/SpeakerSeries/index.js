import React from "react";
import styled from "styled-components";
import { COLORS } from "../../constants";
import Modal from "../../components/Modal";
import SpeakerCard from "./SpeakerCard";
import SpeakerDetailFrame from "./SpeakerDetailFrame.js";
import moment from "moment";

import { getSpeakerSeriesList } from "../../api";

const SpeakerSeriesPageWrapper = styled.div`
  padding: 100px;
`;
const SpeakerSeriesHeader = styled.div`
  padding-bottom: 48px;
  display: block;
  align-items: center;
  margin: 0 auto;
  text-align: center;

  div {
    align-items: center;
    margin: 0 auto;
  }

  img {
    border-radius: 50%;
    margin-right: 50px;
  }

  h1 {
    font-size: 45px;
    margin: 0;
  }

  p {
    font-size: 24px;
    margin-top: 20;
  }
`;
const SpeakerSeriesWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 50px;
`;

const SpeakerSeriesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  padding: 0px 50px;
  margin: 0 auto;
`;
const UpcomingEventsHeader = styled.div`
  text-align: center;
  h2 {
    color: ${COLORS.blue};
  }
`;
const PastEventsHeader = styled.div`
  text-align: center;
  h2 {
    color: ${COLORS.blue};
  }
`;
const SpeakerSeriesPage = () => {
  const [speakerSeries, setSpeakerSeries] = React.useState([]);

  // API request to get speaker series data.
  React.useEffect(() => {
    getSpeakerSeriesList()
      .then((data) => {
        setSpeakerSeries(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const speakerSeriesPastData = speakerSeries.filter((data) =>
    moment(data.date).isBefore(new Date())
  );
  const speakerSeriesUpComingData = speakerSeries.filter((data) =>
    moment(data.date).isAfter(new Date())
  );

  const launched = false;

  // TODO redo the styling of this page
  return (
    <SpeakerSeriesPageWrapper>
      <SpeakerSeriesHeader>
        <div>
          <h1>Speaker Series</h1>
          <p>This Speaker series is series of event hosted by CovEd.</p>
        </div>
      </SpeakerSeriesHeader>
      <UpcomingEventsHeader>
        <h2>Upcoming Events</h2>
      </UpcomingEventsHeader>

      <SpeakerSeriesWrapper>
        <SpeakerSeriesContainer>
          {speakerSeriesUpComingData.length > 0 && launched ? (
            speakerSeriesUpComingData.map((speaker) => {
              return (
                <Modal
                  title={speaker.name}
                  key={speaker._id}
                  trigger={
                    <div>
                      <SpeakerCard speaker={speaker} />
                    </div>
                  }
                >
                  <SpeakerDetailFrame speaker={speaker} />
                </Modal>
              );
            })
          ) : (
            <p>There are no upcoming events to display at this time.</p>
          )}
        </SpeakerSeriesContainer>
      </SpeakerSeriesWrapper>
      <PastEventsHeader>
        <h2>Past Events</h2>
      </PastEventsHeader>
      <SpeakerSeriesWrapper>
        <SpeakerSeriesContainer>
          {speakerSeriesPastData.length > 0 && launched ? (
            speakerSeriesPastData.map((speaker) => {
              return (
                <Modal
                  title={speaker.name}
                  key={speaker._id}
                  trigger={
                    <div>
                      <SpeakerCard speaker={speaker} />
                    </div>
                  }
                >
                  <SpeakerDetailFrame speaker={speaker} />
                </Modal>
              );
            })
          ) : (
            <p>There are no past events to display at this time.</p>
          )}
        </SpeakerSeriesContainer>
      </SpeakerSeriesWrapper>
    </SpeakerSeriesPageWrapper>
  );
};

export default SpeakerSeriesPage;
