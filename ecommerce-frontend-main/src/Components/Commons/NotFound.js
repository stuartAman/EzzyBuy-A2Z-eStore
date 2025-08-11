import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import {useNavigate} from "react-router";
import React from 'react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
        >
            <Typography variant={'h1'}> 404 </Typography>
            <Typography variant={'h4'}> Page Not Found. <Link onClick={() => navigate('/')}>Home</Link> </Typography>
        </Grid>
    );
}

export default NotFound;