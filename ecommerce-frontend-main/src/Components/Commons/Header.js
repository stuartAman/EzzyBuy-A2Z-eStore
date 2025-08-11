import {AppBar, Box, Button, Stack, Toolbar, Typography} from '@mui/material';
import {Favorite, ShoppingCart} from '@mui/icons-material';
import {Outlet, useNavigate} from 'react-router-dom';
import SearchBox from "./SearchBox";
import UserButton from "./UserButton";
import React, {useContext} from 'react';
import Footer from "./Footer";
import client from "../../api/HttpClient";
import Badge from "@mui/material/Badge";
import {UserContext} from "../../Context/UserContext";

const Header = () => {
    // hooks
    const navigate = useNavigate();

    // Context
    const user = useContext(UserContext);

    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}>
                <Box component="header" sx={{mb: 9.5}}>
                    <AppBar position={"fixed"}>
                        <Toolbar>
                            {/*Logo with Home button*/}
                            <Stack
                                direction="row"
                                sx={{
                                    justifyContent: 'center',
                                    alignItems: 'end',
                                }}
                            >
                                <Button
                                    onClick={() => {
                                        user.refresh();
                                        navigate('/')
                                    }}
                                    sx={{p: 0, ml: 10}}>
                                    <Box
                                        component="img"
                                        src={`${client.defaults.baseURL}/orders/invoice/image/logo.png`}
                                        alt="Ezzy Buy Logo"
                                        sx={{
                                            width: 'auto',
                                            objectFit: 'scale-down',
                                            height: 72
                                        }}
                                    />
                                </Button>
                            </Stack>

                            {/*Search Box*/}
                            <Stack
                                direction="row"
                                sx={{
                                    flexGrow: 1,
                                    px: 10
                                }}
                            >
                                <SearchBox/>
                            </Stack>
                            <Stack direction='row' spacing={3}>
                                {/*Right Side Buttons*/}
                                <Button
                                    size="medium"
                                    sx={{
                                        color: theme => theme.palette.primary.contrastText,
                                        ':hover': theme => {
                                            return {bgcolor: theme.palette.primary.dark}
                                        }
                                    }}
                                    onClick={() => {
                                        user.refresh();
                                        if (user.details.get)
                                            navigate('/wishlist');
                                        else
                                            navigate('/Login?ref=/wishlist');
                                    }}
                                    startIcon={
                                        <Badge badgeContent={user.wCount.get} color="secondary">
                                            <Favorite/>
                                        </Badge>
                                    }
                                >
                                    <Typography
                                        variant={'subtitle1'}
                                        sx={{textTransform: 'capitalize'}}
                                    >
                                        WishList
                                    </Typography>
                                </Button>
                                <Button
                                    size="medium"
                                    sx={{
                                        color: theme => theme.palette.primary.contrastText,
                                        ':hover': theme => {
                                            return {bgcolor: theme.palette.primary.dark}
                                        }
                                    }}
                                    onClick={() => {
                                        user.refresh();
                                        navigate('/cart')
                                    }}
                                    startIcon={
                                        <Badge badgeContent={user.cCount.get} color="secondary">
                                            <ShoppingCart/>
                                        </Badge>
                                    }
                                >
                                    <Typography
                                        variant={'subtitle1'}
                                        sx={{textTransform: 'capitalize'}}
                                    >
                                        Cart
                                    </Typography>
                                </Button>
                                {/*Authorized button*/}
                                <UserButton/>
                            </Stack>
                        </Toolbar>
                    </AppBar>
                </Box>
                <Box>
                    <Outlet/>
                </Box>
                <Footer/>
            </Box>
        </>
    );
}

export default Header;
