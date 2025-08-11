import React, {createContext, useEffect, useState} from "react";
import AuthService from "../api/AuthService";
import WishListService from "../api/WishListService";
import CartService from "../api/CartService";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {useNavigate} from "react-router-dom";

export const UserContext = createContext(undefined);

const UserProvider = (props) => {
    // states
    const [details, setDetails] = useState(null);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [refresh, setRefresh] = useState(Date.now());
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("info");

    // Routing
    const navigate = useNavigate();

    const sessionCheck = () => {
        AuthService.isSessionAvailable()
            .catch((error) => {
                console.log(error.response)
                console.log("dsadsadasdsad")
                if (error.response.status === 401) {
                    AuthService.logout();

                    setMessage("Your session has expired please login again.");
                    setOpen(true);

                    navigate('/login');
                }
            })
    };

    // Value
    const data = {
        details: {
            get: details,
            set: setDetails
        },
        wCount: {
            get: wishlistCount,
            set: setWishlistCount
        },
        cCount: {
            get: cartCount,
            set: setCartCount
        },
        bar: {setOpen, setMessage, setSeverity},
        refresh: () => setRefresh(Date.now())
    }

    useEffect(() => {
        setDetails(AuthService.getUserDetails());
        setWishlistCount(WishListService.getWishListLength());
        setCartCount(CartService.getCartLength());
    }, []);

    useEffect(() => {
        setDetails(AuthService.getUserDetails());
        setWishlistCount(WishListService.getWishListLength());
        setCartCount(CartService.getCartLength());

        if (AuthService.getUserDetails())
            sessionCheck();
    }, [refresh]);

    // Snackbar
    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return;

        setOpen(false);
        setSeverity("info");
    };

    return (
        <UserContext.Provider value={data}>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} sx={{width: '100%'}}>
                    {message}
                </Alert>
            </Snackbar>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserProvider;
