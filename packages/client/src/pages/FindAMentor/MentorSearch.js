import React, { useEffect, useState } from "react";
import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  Configure,
  connectSearchBox,
  PoweredBy,
  connectPagination,
} from "react-instantsearch-dom";
import MentorHits from "./MentorGrid";
import TextField from "@material-ui/core/TextField";
import MdPagination from "@material-ui/lab/Pagination";
import styled from "styled-components";
import MentorFilters from "./MentorFilters";
import { Grid } from "@material-ui/core";
import { get } from "../../utilities";

const SearchBox = connectSearchBox(({ currentRefinement, refine }) => {
  return (
    <TextField
      id="search-bar"
      label="Search"
      variant="filled"
      value={currentRefinement}
      onChange={(e) => refine(e.currentTarget.value)}
      InputProps={{
        endAdornment: <PoweredBy />,
      }}
      fullWidth
    />
  );
});

// TODO center pagination
const Pagination = connectPagination(
  ({ currentRefinement, nbPages, refine }) => {
    const handleChange = (e, selectedPage) => {
      e.preventDefault();
      refine(selectedPage);
    };

    return (
      <MdPagination
        count={nbPages}
        page={currentRefinement}
        onChange={handleChange}
        color="primary"
      />
    );
  }
);

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1em;
`;

const MentorSearch = () => {
  let [algoliaAppId, setAlgoliaAppId] = useState(null);
  let [algoliaApiKey, setAlgoliaApiKey] = useState(null);

  useEffect(() => {
    if (!algoliaAppId || !algoliaApiKey) {
      get("/algolia/credentials").then(({ key, appId }) => {
        setAlgoliaApiKey(key);
        setAlgoliaAppId(appId);
      });
    }
  });
  if (!algoliaAppId || !algoliaApiKey) {
    return <div>Loading...</div>;
  }
  const searchClient = algoliasearch(algoliaAppId, algoliaApiKey);
  const displayFilter = false;
  return (
    <div className="ais-InstantSearch">
      <InstantSearch indexName={"mentors"} searchClient={searchClient}>
        <Grid container justify="center" spacing={0}>
          <Configure hitsPerPage={12} filters="available:true" />
          <SearchBox />
          { displayFilter && (
             <Grid item xs={3}>
              <MentorFilters attribute="tags" />
              </Grid>
          )}
          <Grid item xs={9}>
            <MentorHits />
            <PaginationContainer>
              <Pagination showLast={true} />
            </PaginationContainer>
          </Grid>
        </Grid>
      </InstantSearch>
    </div>
  );
};

export default MentorSearch;
