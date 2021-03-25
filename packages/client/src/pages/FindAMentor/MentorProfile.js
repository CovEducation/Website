import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../components/Button";
import TextField from "@material-ui/core/TextField";
import Jdenticon from "react-jdenticon";
import useAuth from "../../providers/AuthProvider";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";

const SELECT_ITEM_HEIGHT = 48;
const SELECT_ITEM_PADDING_TOP = 8;
const SelectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: SELECT_ITEM_HEIGHT * 4.5 + SELECT_ITEM_PADDING_TOP,
    },
  },
};

const WizardInput = styled.div`
  margin-bottom: 1em;
  min-width: 120px;
`;

const MentorProfileContainer = styled.div`
  padding: 0 50px;
`;

const MentorProfileHeader = styled.div`
  display: flex;
  flex-direction: row;
`;

const MentorProfileInformation = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;

const MentorProfilePicture = styled.img`
  width: 20%;
  margin-right: 1rem;
  border-radius: 100%;
`;

const MentorDetailsBlock = styled.div`
  h3 {
    font-size: 1.5rem;
    font-weight: 400;
    margin: 10px 0;
  }
  h4 {
    font-weight: 400;
    margin: 0;
    font-size: 1.2rem;
  }
`;

const MentorProfileText = styled.p`
  margin-right: 0.5rem;
`;

const ButtonBlock = styled.div`
  text-align: right;
  button {
    margin-right: 0px;
  }
`;

// Displays the picture, name, and major of a mentor.
const MentorProfile = ({ mentor, onSubmit, disable }) => {
  const { user } = useAuth();
  const { students } = user;
  const [userMessage, setUserMessage] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentID, setStudentID] = useState("");
  const [validation, setValidation] = useState(true);
  if (!validateMentorData(mentor)) return <></>;

  const relevantInformationMentor = [
    ["subjects", "Subjects"],
    ["location", "Location"],
    ["gradeLevels", "Grades"],
    ["region", "Region"],
    ["languages_spoken", "Languages"],
  ];

  const relevantInformationParent = [
    ["subjects", "Subjects"],
    ["location", "Location"],
    ["gradeLevels", "Grades"],
    ["region", "Region"],
    ["languages_spoken", "Languages"],
  ];

  const sendRequest = async () => {
    await onSubmit(user._id, mentor.objectID, studentID, userMessage);
  };

  const studentList =
    students &&
    students.map((item) => {
      return (
        <MenuItem key={item._id} value={item.name} data-id={item._id}>
          {item.name}
        </MenuItem>
      );
    });

  const handleChange = (event) => {
    setStudentName(event.target.value);
    // Efficiency.

    let id = students.filter((stud) => stud.name === event.target.value)[0]._id;
    setStudentID(id);
    setValidation(false);
  };

  // Note:
  // Algolia stores the mongoID as "id" not "_id"

  return (
    <MentorProfileContainer key={mentor.id}>
      <MentorProfileHeader>
        <Jdenticon size="150" value={mentor.name} />
        <MentorDetailsBlock>
          <h3>{mentor.name}</h3>
          <h4><b>College:</b> {mentor.college}</h4>
          <h4><b>Major:</b> {mentor.major}</h4>
          <h4><b>Pronouns:</b>  {mentor.pronouns}</h4>
        </MentorDetailsBlock>
        <div></div>
      </MentorProfileHeader>
      {mentor.introduction !== null && mentor.introduction !== undefined && (
        <div>
          <p>
            <b>Introduction</b>
          </p>
          <p>{mentor.introduction}</p>
        </div>
      )}
      <MentorProfileInformation>
        {user.role === "PARENT"
          ? relevantInformationParent.map((field) =>
              displayField(field, mentor)
            )
          : relevantInformationMentor.map((field) =>
              displayField(field, mentor)
            )}
      </MentorProfileInformation>
      {user.role === "PARENT" && (
        <>
          <WizardInput>
            <InputLabel id="wizard-pronouns" required>
              Please Select Student
            </InputLabel>
            <Select
              children={studentList}
              fullWidth
              labelId="wizard-pronoun"
              MenuProps={SelectMenuProps}
              name="studentName"
              onChange={handleChange}
              renderValue={(selected) => selected}
              value={studentName}
              required
            />
          </WizardInput>
          <WizardInput>
            <TextField
              fullWidth
              label="Request Message"
              name="request"
              id="request"
              onChange={(e) => {
                setUserMessage(e.target.value);
              }}
            />
          </WizardInput>
          <ButtonBlock>
            <Button
              disabled={disable || validation}
              theme="accent"
              size="md"
              onClick={() => sendRequest()}
            >
              Send Request
            </Button>
          </ButtonBlock>
        </>
      )}
    </MentorProfileContainer>
  );
};

const validateMentorData = (mentor) => {
  if (mentor === undefined || mentor === null) return false;
  // TODO(johancc) - Implement a more through validation if needed.
  return true;
};

const displayField = (field, mentor) => {
  let mentorInfo = mentor[field[0]];
  if (Array.isArray(mentorInfo)) {
    mentorInfo = mentorInfo
      .map((v) => {
        try {
          // https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
          return v.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          });
        } catch {
          return v;
        }
      })
      .join(", ");
  }

  return (
    <>
      {mentorInfo && (
        <div>
          <MentorProfileText>
            <b>{field[1]}</b>
          </MentorProfileText>
          <MentorProfileText>{mentorInfo}</MentorProfileText>
        </div>
      )}
    </>
  );
};

export default MentorProfile;
