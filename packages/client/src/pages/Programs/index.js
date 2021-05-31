import React from "react";
import styled from "styled-components";
import { Container } from "@material-ui/core";
import { Trans, useTranslation } from "react-i18next";


const Banner = styled.img`
    max-width: 100%;
    max-height: 100vh;
    margin: auto;
`

const PopularClasses = [
    {
        name: "James and the Giant Peach book club",
        description: "recommended for 1st and 2nd graders",
    },
    {
        name: "Percy Jackson book club",
        description: "recommended for 5th through 8th graders",
    },
    {
        name: "Brave New World book club",
        description: "recommended for High School students",
    },
    {
        name: "Abstract acrylic and oil painting",
        description: "recommended for students who are artistically inclined and want to grow their skills",
    },
    {
        name: "Drawing techniques",
        description: "recommended for students who are artistically inclined and want to grow their skills",
    },
    {
        name: "Beginner Chess Club",
        description: "for students new to the game"
    },
    {
        name: "Intermediate Chess Club",
        description: "for students who want to improve their play via learning openings and tactics"
    }
]



const ProgramPage = () => {

    return (
        <Container maxWidth="md">
            <Banner src="/images/coved_art_club.png"></Banner>
            <Banner src="/images/coved_book_club.png"></Banner>
            <Banner src="/images/coved_chess_club.png"></Banner>

            <p>
                CovEd now offers Art, Book, and Chess club for K-12 students!
                Students can learn art skills and make creative projects, read
                and discuss books, learn and play chess, and make new friends
                from all over America!
            </p>

            <p>
                You can view our class catalog <a href="https://www.canva.com/design/DAEem364Q9w/AtBjSn4ioJ_SYGMskS_BPQ/view">here</a>.
                Some of our most popular classes are:
            </p>
            <ul>
                {PopularClasses.map(({ name, description }) =>
                    <li><strong>{name}</strong>, {description} </li>)}
            </ul>

            <p>
                Classes are offered for ALL ages and skill levels. Students can
                sign up for whichever class they want!
            </p>

            <p>
                If you are interested in signing your students up for these
                clubs, go to <a href="https://bit.ly/coved-abc-student">bit.ly/coved-abc-student</a>.
            </p>


        </Container>
    );
}

export default ProgramPage;
