import React, {useEffect, useState} from 'react';
import CategoryService from "../../api/CategoryService";
import CategoryCard from "./CategoryCard";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const CategoryBar = () => {

    // Render Categories
    const [categories, setCategories] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const getCategories = () => {
        CategoryService.getCategoryList()
            .then(response => {
                setCategories(response);
                setErrorMessage(null);
            })
            .catch(error => {
                setCategories(null);
                setErrorMessage(error.message);
            })
    }

    // Init
    useEffect(() => getCategories(), []);

    return (
        <Stack
            direction="row"
            spacing={2}
            justifyContent="space-around"
            alignItems="center"
            sx={{maxWidth: "100%"}}
        >
            {
                categories &&
                categories.map((category, idx) => <CategoryCard key={idx} category={category}/>)
            }
            {
                errorMessage &&
                <Alert severity="error" sx={{m: 2, flexGrow: 1}}>
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage} — <strong onClick={() => getCategories()}>Reload</strong>
                </Alert>
            }
        </Stack>
    );
};

export default CategoryBar;
