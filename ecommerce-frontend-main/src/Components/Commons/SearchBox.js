import React, {useContext, useState} from "react";
import {Search} from "@mui/icons-material";
import {useLocation, useNavigate} from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import {SearchContext} from "../../Context/SearchContext";

const SearchBox = (props) => {
    // Context
    const search = useContext(SearchContext);

    // Hooks
    const [searchText, setSearchText] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    // Search Field Handler
    const searchTextHandler = (event) => {
        setSearchText(event.target.value);
    }

    const searchHandler = () => {
        // Only When Query text in Box
        if (searchText.length > 0) {
            if (!(location.pathname === 'search')) {
                // navigate to search
                navigate(`search?query=${searchText}&page=1`);
                search.by.set("query");
                search.page.set(1);
                search.keyword.set(searchText);
            } else {
                // change Query
                search.params.set({
                    'query': searchText,
                    page: 1
                })
                search.by.set("query");
                search.page.set(1);
                search.keyword.set(searchText);
            }
        }
    }

    return (
        <>
            <InputBase
                placeholder={props.placeholder ? props.placeholder : "Search for products..."}
                value={searchText}
                onChange={searchTextHandler}
                sx={{
                    flexGrow: 1,
                    borderTopLeftRadius: theme => theme.shape.borderRadius + 'px',
                    borderBottomLeftRadius: theme => theme.shape.borderRadius + 'px',
                    backgroundColor: 'background.paper',
                    padding: '4px',
                    paddingInline: 1,
                    marginLeft: 1,
                    minWidth: 200,
                }}
                onKeyUp={(event) => {
                    if (event.key === "Enter")
                        searchHandler();
                }}
            />
            <IconButton
                sx={{
                    backgroundColor: 'background.paper',
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderTopRightRadius: theme => theme.shape.borderRadius + 'px',
                    borderBottomRightRadius: theme => theme.shape.borderRadius + 'px',
                    padding: 1,
                    marginRight: 1,
                    ':hover': theme => {
                        return {
                            color: theme.palette.primary.main,
                            bgcolor: theme.palette.primary.contrastText,
                        }
                    }
                }}
                onClick={searchHandler}
            >
                <Search/>
            </IconButton>
        </>
    );
}

export default SearchBox;