import React, { useState, useEffect } from "react";
import styled from "styled-components";
import AlertTitle from "@material-ui/lab/AlertTitle";
import Alert from "@material-ui/lab/Alert";
import { COLORS } from "../../constants";
import Button from "../../components/Button";
import Jdenticon from "react-jdenticon";
import useAuth from "../../providers/AuthProvider";
import Toast from "../../components/Toast/index.js";
import {
  getRequests,
  acceptRequest,
  rejectRequest,
  archiveRequest,
  addSession,
} from "../../api";

const RequestsPageWrapper = styled.div`
  padding: 100px;
`;
const FlexClass = styled.div`
  display: grid;
  text-align: center;
`;
const FlexClass1 = styled.div`
  display: grid;
  text-align: center;
  img {
    margin: 0 auto;
  }
`;
const RequestsHeader = styled.div`
  padding-bottom: 48px;
  display: block;
  align-items: center;
  margin: 0 auto;
  text-align: center;
  clear: both;
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
    margin: 0;
  }
`;
const RequestsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 50px;
  width: 50%;
  float: left;
  justify-content: center;
`;
const RequestsWrapperPending = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 50px;
  justify-content: center;
`;
const RequestDetailsBlock = styled.div`
  display: flex;
  align-items: center;
  margin-left: 50px;
  p {
    font-size: 24px;
  }
  span {
    color: ${COLORS.blue};
    border-bottom: 2px solid;
  }
`;

const BlueColor = styled.span`
  color: blue;
`;
const GreenColor = styled.span`
  color: green;
`;
const YellowColor = styled.span`
  color: #9c27b0;
`;
const RedColor = styled.span`
  color: red;
`;

const RequestsPage = () => {
  const { user } = useAuth();
  // { durationMinutes: int, date: Date, rating: int }
  const [session, setSession] = useState({});
  const [toastOpen, setToastOpen] = useState(false);
  const [status] = useState("");
  const [message, setMessage] = useState("");
  const [mentorships, setMentorships] = useState([]);

  useEffect(() => {
    getRequests().then((requests) => {
      setMentorships(requests);
    });
  }, []);

  const getDate = (d) => {
    try {
      return new Date(d).toDateString();
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const hasRequests = () => {
    return mentorships.length > 0;
  };

  const getRatingsFixed = (d) => {
    var a = parseFloat(d);
    if (d === 0) {
      return 0;
    }
    return a.toFixed(1);
  };

  const pendingRequestsList = mentorships
    .filter((item) => {
      return (
        item.student != null &&
        item.student !== undefined &&
        item.student.name !== undefined &&
        item.state === "PENDING"
      );
    })
    .map((item) => (
      <RequestsWrapperPending>
        <Jdenticon size="150" value={item.student.name} />
        <div>
          {user.role === "MENTOR" ? (
            <p>
              <b>Parent: </b>
              {item.parent.name}
              <br />
              <b>Student: </b>
              {item.student.name}
              <br />
              {item.message && (
                <>
                  <b>Message: </b>
                  {item.message}
                </>
              )}
              <br />
              <b>Status: </b>
              <BlueColor>{item.state}</BlueColor>
            </p>
          ) : (
            <p>
              <b>Student: </b>
              {item.student.name}
              <br />
              <b>Mentor: </b>
              {item.mentor.name}
              <br />
              {item.message && (
                <>
                  <b>Message: </b>
                  {item.message}
                </>
              )}
              <br />
              <b>Status: </b>
              <BlueColor>{item.state}</BlueColor>
            </p>
          )}
        </div>
        {user.role === "MENTOR" && (
          <RequestDetailsBlock>
            <Button
              theme="accent"
              size="sm"
              onClick={() =>
                acceptRequest(item).then(() => {
                  setMessage("Request Accepted");
                  setToastOpen(true);
                  setTimeout(() => {
                    setToastOpen(false);
                  }, 3000);

                  // Update the state:
                  getRequests().then((requests) => {
                    setMentorships(requests);
                  });
                })
              }
            >
              {" "}
              Accept{" "}
            </Button>
            <Button
              theme="danger"
              size="sm"
              onClick={() =>
                rejectRequest(item).then(() => {
                  setMessage("Request Rejected");
                  setToastOpen(true);
                  setTimeout(() => {
                    setToastOpen(false);
                  }, 3000);
                  // Update the state:
                  getRequests().then((requests) => {
                    setMentorships(requests);
                  });
                })
              }
            >
              {" "}
              Reject{" "}
            </Button>
          </RequestDetailsBlock>
        )}
      </RequestsWrapperPending>
    ));

  const mentorshipList = mentorships
    .filter((item) => item.student !== null)
    .map((item) => (
      <RequestsWrapper>
        {item.state === "ACTIVE" && (
          <FlexClass1>
            <Jdenticon size="150" value={item.student.name} />
            <Button
              theme="danger"
              size="sm"
              onClick={() =>
                archiveRequest(item).then(() => {
                  setMessage("Request Archived");
                  setToastOpen(true);
                  setTimeout(() => {
                    setToastOpen(false);
                  }, 3000);

                  // Update the state:
                  getRequests().then((requests) => {
                    setMentorships(requests);
                  });
                })
              }
            >
              {" "}
              End Membership{" "}
            </Button>
          </FlexClass1>
        )}
        {user.role === "MENTOR" && item.state === "ACTIVE" && (
          <FlexClass>
            <Jdenticon size="150" value={item.student.name} />
          </FlexClass>
        )}
        {(user.role === "PARENT" || user.role === "MENTOR") &&
          item.state !== "ACTIVE" && (
            <FlexClass>
              <Jdenticon size="150" value={item.student.name} />
            </FlexClass>
          )}
        <div>
          <p>
            {" "}
            <b>Mentor: </b> {item.mentor.name}{" "}
          </p>
          <p>
            {" "}
            <b>Student: </b>
            {item.student.name}{" "}
          </p>
          <p>
            {item.startDate && (
              <>
                <b>Start date: </b> {getDate(item.startDate)}
              </>
            )}
          </p>
          <p>
            {item.endDate && (
              <>
                <b>End date: </b> {getDate(item.startDate)}
              </>
            )}
          </p>
          <p>
            {" "}
            <b>Status: </b>
            {item.state === "ACTIVE" && <GreenColor>{item.state}</GreenColor>}
            {item.state === "ARCHIVED" && (
              <YellowColor>{item.state}</YellowColor>
            )}
            {item.state === "REJECTED" && <RedColor>{item.state}</RedColor>}
          </p>
          <p>
            <b>Session Hours: </b>
            {Math.floor(
              item.sessions
                .map((session) => session.durationMinutes)
                .reduce((a, b) => a + b, 0) / 60
            )}
          </p>
          {user.role === "MENTOR" && (
            <p>
              <b>Ratings: </b>
              <span>
                {item.sessions && item.sessions.length > 0
                  ? item.sessions
                      .map((session) => session.rating)
                      .map((rating) => getRatingsFixed(rating))
                  : "No ratings yet."}
              </span>
            </p>
          )}
          {user.role === "PARENT" && (
            <p>
              <b>Avg. Ratings: </b>
              <span>
                {item.sessions && item.sessions.length > 0
                  ? getRatingsFixed(
                      item.sessions
                        .map((session) => session.rating)
                        .reduce((a, b) => a + b, 0) / item.sessions.length
                    )
                  : "No ratings yet."}
              </span>
            </p>
          )}
          {user.role === "MENTOR" && item.state === "ACTIVE" && (
            <div>
              <p>
                <b>Session Hours: </b>
                <input
                  type="number"
                  id="sessionHours"
                  onChange={(e) => {
                    setSession({
                      ...session,
                      durationMinutes: Math.floor(Number(e.target.value) * 60),
                    });
                  }}
                ></input>
              </p>
            </div>
          )}
          {user.role === "PARENT" && item.state === "ACTIVE" && (
            <div>
              <p>
                <b>Rate my last session: </b>
                <input
                  type="number"
                  id="ratingsInput"
                  onChange={(e) => {
                    setSession({
                      ...session,
                      rating: Math.floor(Number(e.target.value)),
                    });
                  }}
                  max="5"
                ></input>
              </p>
              <Button
                theme="accent"
                size="sm"
                onClick={() => {
                  addSession({ _id: item._id }, session);
                  // Update the state:
                  getRequests().then((requests) => {
                    setMentorships(requests);
                  });
                }}
              >
                Submit Session
              </Button>
            </div>
          )}
        </div>
      </RequestsWrapper>
    ));

  return (
    <RequestsPageWrapper>
      <Toast open={toastOpen} message={message} status={status} />
      <RequestsHeader>
        <div>
          <h1>Pending Requests</h1>
        </div>
      </RequestsHeader>

      {hasRequests &&
      mentorships.filter((v) => v.state === "PENDING").length > 0 ? (
        pendingRequestsList
      ) : (
        <>
          <Alert severity="info" style={{ marginBottom: "4em" }}>
            <AlertTitle>No pending requests</AlertTitle>
            We will notify you when you receive a mentorship request. Thanks for
            volunteeering!
          </Alert>
        </>
      )}

      <RequestsHeader>
        <div>
          <h1>Mentorships</h1>
        </div>
      </RequestsHeader>
      {hasRequests &&
      mentorships.filter((v) => v.state !== "PENDING").length > 0 ? (
        mentorshipList
      ) : (
        <>
          <Alert severity="info">
            <AlertTitle>No active or previous mentorships</AlertTitle>
            Once you accept a mentorship request, you will be able to see your
            current and past mentorships here.
          </Alert>
        </>
      )}
    </RequestsPageWrapper>
  );
};

export default RequestsPage;
