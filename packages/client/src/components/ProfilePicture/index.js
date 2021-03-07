import { Avatar } from "@material-ui/core";
import React from "react";
import Jdenticon from "react-jdenticon";
import styled from "styled-components";
import { COLORS } from "../../constants";

const ProfilePicture = ({ size, value }) => {
  const AvatarPic = styled(Avatar)`
    background-color: ${COLORS.lightorange};
    width: ${size}px;
    height: ${size}px;
    margin-right: 1em;
    margin-left: 1em;
  `;

  return (
    <AvatarPic>
      <Jdenticon size={size} value={value} />
    </AvatarPic>
  );
};

export default ProfilePicture;
