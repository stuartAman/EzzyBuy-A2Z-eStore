import React from 'react';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import client from "../../api/HttpClient";
import {Link} from 'react-router-dom';
import useTheme from "@mui/material/styles/useTheme";

const Footer = () => {
    // Theme
    const theme = useTheme();

    return (
        <Box
            component="footer"
            sx={{
                mt: 'auto',
            }}
        >
            <Paper
                sx={{
                    mt: 2,
                    py: 1,
                    px: 2,
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[300]
                            : theme.palette.grey[800]
                }}
            >
                <Stack
                    direction="row"
                    sx={{
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Box
                        component="img"
                        src={`${client.defaults.baseURL}/orders/invoice/image/logo.png`}
                        alt="Ezzy Buy Logo"
                        sx={{
                            width: 'auto',
                            objectFit: 'scale-down',
                            height: 64
                        }}
                    />
                    <Typography variant="body1" color="text.secondary" align="center">
                        {'Copyright © '}
                        {' Ezzy Buy '}
                        {new Date().getFullYear()}
                    </Typography>
                    <Link
                        to={'/contact'}
                        style={{
                            color: theme.palette.primary.main,
                            textDecoration: 'none'
                        }}
                    >
                        <Typography variant="subtitle1" sx={{color: 'text'}}>Contact Us</Typography>
                    </Link>
                </Stack>
            </Paper>
        </Box>
    );
};

export default Footer;
