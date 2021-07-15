import { FormControl, FormControlLabel, makeStyles, Button } from "@material-ui/core";
import React, { useState } from "react";
import { connectRefinementList } from "react-instantsearch-dom";
import Accordion, { AccordionRow } from "../../components/Accordion";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    padding: "0 2em 0 2em",
  },
}));

const CustomRefinementList = ({ items, currentRefinement, refine, ...props }) => {
  const classes = useStyles();
  const [extended, setExtended] = useState(false);
  const limit = extended ? props.showMoreLimit : props.limit
  return (
    <div>
    {items.slice(0,limit).map((item) => {
      return(
        <div className={classes.root}>
          <FormControl className={classes.formControl}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={item.isRefined}
                  onChange={() => refine(item.value)}
                  name={item.label}
                />
              }
              label={item.label+" ("+item.count+")"}
            />
          </FormControl>
        </div>)})}
  <Button 
    variant="outlined"
    color="primary"
    size="sm"
    theme="accent"
    onClick={() => setExtended(!extended)}>
    {extended ? 'Show less' : 'Show more'}
  </Button>
  </div>
  );
};

const MentorRefinementList = connectRefinementList(CustomRefinementList);

const MentorFilters = () => {
  return (
    <div>
      <Accordion>
        <AccordionRow title="Student Grade Level or Program">
          <MentorRefinementList attribute="gradeLevels" operator="or" showMore={true} limit={3} showMoreLimit={10} searchable={true}/>
        </AccordionRow>
        <AccordionRow title="Subjects">
          <MentorRefinementList attribute="subjects" operator="and" limit={15} showMoreLimit={50} showMore searchable/>
        </AccordionRow>
      </Accordion>
    </div>
  );
};
export default MentorFilters;
