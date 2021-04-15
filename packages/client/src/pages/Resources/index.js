import React from "react";
import styled from "styled-components";
import { FONTS, COLORS } from "../../constants";
import Accordion, { AccordionRow } from '../../components/Accordion';
import Grid from '@material-ui/core/Grid';
import Footer from '../../components/Footer';

const Wrapper = styled.div`
  text-align: left;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  p {
    font-family: ${FONTS.font2};
  }
  h2 {
    font-family: ${FONTS.font1};
    font-weight: 500;
    padding-top: 20px;
    text-align: center;
  }
  a {
    color: ${COLORS.darkblue};
    font-weight: 500;
    text-decoration: none;
  }
  a:hover {
    color: ${COLORS.yellow};
  }
`;

const ResourcesPage = () => {
  return (
    <>
    <Wrapper>
        <h2> Resources </h2>
        <Grid container direction="row" justify="center" spacing={2}>
          <Grid item sm={8} xs={10}>
          Welcome to our resources page! Here you will be able to find links to more online learning resources. Don't have a mentor yet, but need help in a particular subject? No problem! Check out our <a target="_blank" href="https://www.piazza.com/coveducation/other/coved1/home"> Piazza page</a>! To join the piazza forum, simply follow these <a href="http://tinyurl.com/menteeguideline" target="_blank">written instructions</a>, or follow the <a href="http://tinyurl.com/piazzavid" target="_blank">instructions in this video.</a>
            </Grid>
            <Grid item sm={6} xs={10}>
              <Accordion>
                <AccordionRow title="Math" id={1}>
                  <h3>All Schools</h3>
                  <ul>
                      <li><a href="https://www.khanacademy.org/math" target="_blank"> Khan Academy </a></li>
                      <li><a href="https://mathpickle.com/" target="_blank"> Math Pickle </a></li>
                      <li><a href="https://fullsteam.mit.edu/" target="_blank"> MIT Full STEAM </a></li>
                      <li><a href="https://mass.pbslearningmedia.org/collection/new-school-routines/#.XoahWyUpCEc" target="_blank"> PBS Learning Media</a></li>
                  </ul>
                  <h3>Elementary School</h3>
                  <ul>
                      <li><a href="https://www.abcmouse.com/abt/homepage" target="_blank"> ABCmouse (free trial) </a></li>
                      <li><a href="https://www.funbrain.com/" target="_blank"> FunBrain </a></li>
                      <li><a href="https://jr.brainpop.com/math/" target="_blank"> Brainpop Jr </a></li>
                      <li><a href="https://www.brainpop.com/" target="_blank"> Brainpop</a></li>
                      <li><a href="http://www.math4childrenplus.com/games/" target="_blank"> Math4Children</a></li>
                      <li><a href="https://pbskids.org/games/all-topics/" target="_blank"> PBS Kids</a></li>
                      <li><a href="https://stemnova.weebly.com/" target="_blank"> StemNova</a></li>
                  </ul>
                  <h3>Middle School</h3>
                  <ul>
                      <li><a href="https://www.funbrain.com/" target="_blank"> FunBrain </a></li>
                      <li><a href="https://www.brainpop.com/" target="_blank"> Brainpop</a></li>
                      <li><a href="http://www.math4childrenplus.com/games/" target="_blank"> Math4Children</a></li>
                  </ul>
                  <h3>High School</h3>
                  <ul>
                      <li><a href="https://www.edx.org/learn/ap" target="_blank"> EdX </a></li>
                      <li><a href="https://ocw.mit.edu/index.htm" target="_blank"> MIT OpenCourseware </a></li>
                  </ul>
                </AccordionRow>
                <AccordionRow title="Science" id={2}>
                <h3>All Schools</h3>
                  <ul>
                      <li><a href="https://www.khanacademy.org/science" target="_blank"> Khan Academy </a></li>
                      <li><a href="https://www.labxchange.org/" target="_blank"> LabXchange </a></li>
                      <li><a href="https://fullsteam.mit.edu/" target="_blank"> MIT Full STEAM </a></li>
                      <li><a href="https://mass.pbslearningmedia.org/collection/new-school-routines/#.XoahWyUpCEc" target="_blank"> PBS Learning Media</a></li>
                  </ul>
                  <h3>Elementary School</h3>
                  <ul>
                      <li><a href="https://www.jpl.nasa.gov/edu/learn/tag/search/Mars" target="_blank"> NASA JPL Resources </a></li>
                      <li><a href="https://www.funbrain.com/" target="_blank"> FunBrain </a></li>
                      <li><a href="https://jr.brainpop.com/math/" target="_blank"> Brainpop Jr </a></li>
                      <li><a href="https://www.brainpop.com/" target="_blank"> Brainpop</a></li>
                      <li><a href="https://kids.nationalgeographic.com/" target="_blank"> National Geographic Kids</a></li>
                      <li><a href="https://pbskids.org/games/all-topics/" target="_blank"> PBS Kids</a></li>
                      <li><a href="https://stemnova.weebly.com/" target="_blank"> StemNova</a></li>
                      <li><a href="https://mysteryscience.com/distance-learning" target="_blank"> Mystery science</a></li>
                      <li><a href="https://docs.google.com/document/u/0/d/1SvIdgTx9djKO6SjyvPDsoGlkgE3iExmi3qh2KRRku_w/mobilebasic" target="_blank"> Virtual Field Trips</a></li> 
                  </ul>
                  <h3>Middle School</h3>
                  <ul>
                      <li><a href="https://www.funbrain.com/" target="_blank"> FunBrain </a></li>
                      <li><a href="https://www.brainpop.com/" target="_blank"> Brainpop</a></li>
                      
                  </ul>
                  <h3>High School</h3>
                  <ul>
                      <li><a href="https://www.edx.org/learn/ap" target="_blank"> EdX </a></li>
                      <li><a href="https://ocw.mit.edu/index.htm" target="_blank"> MIT OpenCourseware </a></li>
                  </ul>
                </AccordionRow>
                <AccordionRow title="English/Writing" id={3}>
                One of the best ways to improve writing, reading comprehension, and general english skills is to read! Most libraries offer online ebooks now, so if you don't find something that works below, try picking up a book! You can also listen to <a href="https://stories.audible.com/start-listen" target="_blank">Audible</a>'s collection of children's audiobooks for free while schools are closed.
                <h3>Worksheets, Games, More Resources</h3>
                <ul>
                  <li><a href="http://www.thinkgrowgiggle.com/2020/03/the-best-websites-to-save-for-upper.html?ck_subscriber_id=661348794" target="_blank"> ThinkGrowGiggle Blog</a></li>
                  <li><a href="https://www.seussville.com/parents/" target="_blank"> Seussville</a></li>
                  <li><a href="https://learnathome.scholastic.com/thanks.html" target="_blank"> Scholastic: Leart at Home for Families</a></li>
                  <li><a href="https://www.starfall.com/h/" target="_blank"> Starfall</a></li>
                  <li><a href="https://www.squigglepark.com/" target="_blank"> SquigglePark</a></li>
                  <li><a href="https://www.quill.org/" target="_blank"> Quill</a></li>
                </ul>
                <h3>List of Creative Writing Prompts</h3>
                To practice writing, just start writing! Here are some websites with prompts that can inspire.  
                <ul>
                  <li><a href="https://blog.reedsy.com/creative-writing-prompts/"> 500+ Creative Writing Prompts</a></li>
                  <li><a href="https://www.writersdigest.com/be-inspired/writing-prompts"> The Writer's Digest</a></li>
                </ul>
                </AccordionRow>
                <AccordionRow title="History" id={4}>
                  History is all about stories. You can learn through books, videos, interactive experiences, and more.
                <h3>Exploratory Activities and Virtual Tours</h3>
                <ul>
                  <li><a href="https://www.intrepidmuseum.org/education/online-resources"> Intrepid Museum </a></li>
                  <li><a href="https://macaccess.org/home-new/at-home-activities/"> Museum, Arts and Culture Access Consortium </a></li>
                  <li><a href="https://world-geography-games.com/world.html"> World Geography Games </a></li>
                  <li><a href="https://docs.google.com/document/u/0/d/1SvIdgTx9djKO6SjyvPDsoGlkgE3iExmi3qh2KRRku_w/mobilebasic" target="_blank"> Virtual Field Trips</a></li> 
                </ul>
                </AccordionRow>
                <AccordionRow title="Computer Skills and Programming" id={5}>
                Aside from trying your own coding projects, here are some more resources!
                <ul>
                  <li><a href="https://spandan.unstructured.studio/"> Spandan: </a>Free, online, hands-on creative workshops for middle and high-school students</li>
                  <li><a href="https://www.khanacademy.org/computing" target="_blank"> Khan Academy </a></li>
                  <li><a href="https://scratch.mit.edu/explore/projects/games/" target="_blank"> Scratch </a></li>
                  <li><a href="https://blockly.games/" target="_blank"> Blockly: Logic Puzzles </a></li>
                  <li><a href="https://www.brainpop.com/" target="_blank"> Brainpop</a></li>
                  <li><a href="https://www.edx.org/learn/ap" target="_blank"> EdX </a></li>
                  <li><a href="https://ocw.mit.edu/index.htm" target="_blank"> MIT OpenCourseware </a></li>
                  <li><a href="https://fullsteam.mit.edu/" target="_blank"> MIT Full STEAM </a></li>
                  <li><a href="https://www.codecademy.com/" target="_blank"> CodeAcademy </a></li>
                </ul>
                </AccordionRow>
                <AccordionRow title="College Prep" id={5}>
                <h3>College Prep Coveducation Handbooks</h3>
                <ul>
                  <li><a href="https://drive.google.com/file/d/1-s5C0_57b0fp1ZEXyMLyAldIJ9UmpsFF/view?usp=sharing" target="_blank">College Application Basics</a></li>
                  <li><a href="https://drive.google.com/file/d/11KzeiD1-C1FemI0Tb7_ib4IfIvICyfZW/view?usp=sharing" target="_blank">First Generation College Application Resources (Part 1)</a></li>
                </ul>

                </AccordionRow>
            </Accordion>
          </Grid>
        </Grid>
    </Wrapper>
    <Footer />
    </>
  );
};

export default ResourcesPage;
