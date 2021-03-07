import { Avatar, Card, CardContent, Grid, Typography } from '@material-ui/core';
import React from 'react';
import Jdenticon from 'react-jdenticon';
import styled from 'styled-components';
import ProfilePicture from '../../components/ProfilePicture';

const MentorCardContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 280px;
    min-width: 180px;
    margin: 0.75rem;
    cursor: pointer;
`

const MentorCardText = styled.p`
    font-size: 12px;
`

const MentorCard = ({ mentor }) => {
    return (

        <Grid item sm={4}>
            <Card variant="outlined">
                <CardContent>
                    <ProfilePicture size={50} value={mentor.name} />
                    <Typography variant="h5" component="h2">
                        {mentor.name}
                    </Typography>
                    <Typography color="textSecondary">
                        {mentor.timezone}
                </Typography>
                    <Typography variant="body2" component="p">
                      {mentor.subjects && mentor.subjects.join(', ')}
                    <br />
                        {mentor.gradelevels && mentor.gradelevels.join(', ')}
                    </Typography>
                </CardContent>

            </Card>
        </Grid>
    );
}

export default MentorCard;