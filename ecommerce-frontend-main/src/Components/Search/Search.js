import React, {useContext, useEffect, useState} from 'react';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import SearchService from "../../api/SearchService";
import {SearchContext} from "../../Context/SearchContext";
import ProductCard from "../Commons/ProductCard";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";

const Search = () => {
    // Context
    const search = useContext(SearchContext);

    // States
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // update context
        search.refresh();

        if (search.page.get)
            if (search.by.get === "subcategory") {
                SearchService.searchBySubCategory({
                    keyword: search.keyword.get,
                    pageNumber: search.page.get
                })
                    .then(data => {
                        setProducts(data.products);
                        search.total.set(data.pages);
                        search.page.set(data.page);
                        // Items loaded
                        setLoading(false);
                    })
                    .catch(error => {
                        setLoading(false);
                        console.log(error);
                    });
            } else if (search.by.get === "category") {
                SearchService.searchByCategory({
                    keyword: search.keyword.get,
                    pageNumber: search.page.get
                })
                    .then(data => {
                        setProducts(data.products);
                        search.total.set(data.pages);
                        search.page.set(data.page);
                        setLoading(false);
                    })
                    .catch(error => {
                        console.log(error);
                        setLoading(false);
                    });
            } else if (search.by.get === "query") {
                SearchService.searchByQuery({
                    keyword: search.keyword.get,
                    pageNumber: search.page.get
                })
                    .then(data => {
                        setProducts(data.products);
                        search.total.set(data.pages);
                        search.page.set(data.page);
                        setLoading(false);
                    })
                    .catch(error => {
                        console.log(error);
                        setLoading(false);
                    });
            }
    }, [search.keyword.get, search.page.get]);

    return (
        <Container>
            <Typography
                variant="h5"
                sx={{
                    textTransform: 'capitalize'
                }}
                gutterBottom
            >
                {
                    search.by.get === "query" ? (
                        <>
                            <>Showing results for</>
                            <i>{" " + search.keyword.get}</i>
                        </>
                    ) : (search.keyword.get)
                }
            </Typography>
            <Divider sx={{mb: 1}}/>
            <Stack
                direction="row"
                sx={{
                    alignItem: 'center',
                    justifyContent: 'center',
                    flexGrow: 1
                }}
            >
                <Grid container spacing={2}>
                    {
                        loading ? (
                            <Grid item sm={12}>
                                <Stack
                                    direction="row"
                                    sx={{
                                        flexGrow: 1,
                                        justifyContent: 'center',
                                        height: 300,
                                        alignItems: 'center'
                                    }}
                                >
                                    <CircularProgress/>
                                </Stack>
                            </Grid>
                        ) : products.length > 0 ? (
                            products.map((product, idx) =>
                                <Grid item sm={2.4} key={idx}>
                                    <ProductCard product={product}/>
                                </Grid>
                            )
                        ) : (
                            <Grid item sm={12}>
                                <Stack
                                    direction="row"
                                    sx={{
                                        flexGrow: 1,
                                        justifyContent: 'center',
                                        height: 300,
                                        alignItems: 'center'
                                    }}
                                >
                                    <Typography variant="h6"> No Items Found</Typography>
                                </Stack>
                            </Grid>
                        )}
                </Grid>
            </Stack>
            <Stack
                direction="row"
                sx={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 4
                }}
            >
                <Pagination
                    disabled={loading}
                    count={search.total.get ? search.total.get : 1}
                    page={search.page.get ? search.page.get : 1}
                    onChange={(event, value) => {
                        // disable buttons & start loading animation
                        setLoading(true);

                        // params
                        let p = {};

                        if (search.params.get.get('subcategory'))
                            p.subcategory = search.params.get.get('subcategory');
                        else if (search.params.get.get('category'))
                            p.category = search.params.get.get('category');
                        else if (search.params.get.get('query'))
                            p.query = search.params.get.get('query');

                        p.page = value

                        search.page.set(value);
                        search.params.set(p);
                    }}
                />
            </Stack>
        </Container>
    );
};

export default Search;
