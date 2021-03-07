import { Avatar } from "@material-ui/core";
import React from "react";
import Jdenticon from "react-jdenticon";
import styled from "styled-components";
import { COLORS } from "../../constants";

const ProfilePicture = ({size, value}) => {

    const AvatarPic = styled(Avatar)`
        background-color: ${COLORS.yellow};
        width: ${size}px;
        height: ${size}px;
        margin: 15px;
    `;

    return (
        <AvatarPic>
            <Jdenticon size={size} value={value} />
        </AvatarPic>
    );
}

export default ProfilePicture;