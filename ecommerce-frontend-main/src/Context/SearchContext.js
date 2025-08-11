import React, {createContext, useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";

export const SearchContext = createContext(undefined);

const SearchProvider = (props) => {
    // states
    const [by, setBy] = useState("query");
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(null);
    const [total, setTotal] = useState(1);
    const [refresh, setRefresh] = useState(Date.now());

    // Routing
    const [params, setParams] = useSearchParams();

    // Value
    const data = {
        by: {
            get: by,
            set: setBy
        },
        keyword: {
            get: keyword,
            set: setKeyword
        },
        page: {
            get: page,
            set: setPage
        },
        total: {
            get: total,
            set: setTotal
        },
        params: {
            get: params,
            set: setParams
        },
        refresh: () => setRefresh(Date.now())
    }

    useEffect(() => {
        if (params.get('subcategory')) {
            setBy("subcategory");
            setPage(parseInt(params.get('page')));
            setKeyword(params.get('subcategory'));
        } else if (params.get('category')) {
            setBy("category");
            setPage(parseInt(params.get('page')));
            setKeyword(params.get('category'));
        } else if (params.get('query')) {
            setBy("query");
            setPage(parseInt(params.get('page')));
            setKeyword(params.get('query'));
        }
    }, [refresh]);


    return (
        <SearchContext.Provider value={data}>
            {props.children}
        </SearchContext.Provider>
    );
};

export default SearchProvider;