import React, {useContext, useEffect, useState} from 'react';
import {Box, Paper, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {Add, Close, Favorite, Remove, ShoppingCart} from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import client from "../../api/HttpClient";
import CartService from "../../api/CartService";
import Snackbar from "@mui/material/Snackbar";
import {Link} from 'react-router-dom';
import WishListService from "../../api/WishListService";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import AuthService from "../../api/AuthService";
import {UserContext} from "../../Context/UserContext";

const ProductListCard = ({product, handlers, order, wishlist, cart, history, outlined}) => {
    // States
    const [cartDisabled, setCartDisabled] = useState(false);
    const [saveDisabled, setSaveDisabled] = useState(false);
    const [quantity, setQuantity] = useState(product.quantity);
    const [openBar, setOpenBar] = useState(false);
    const [message, setMessage] = useState("");
    const [render, setRender] = useState(true);
    const [severity, setSeverity] = useState("info");


    // Context
    const user = useContext(UserContext);

    // Cart Handler
    function increaseCart() {
        setCartDisabled(true);

        // Add one at a time
        let newProduct = product;
        newProduct.quantity = 1;
        CartService.addToCart(newProduct)
            .then(() => {
                handlers.changeQuantity(product.id, quantity + 1);
                setQuantity(quantity => quantity + 1);
                setCartDisabled(false);
                user.refresh();
            })
            .catch((error) => {
                user.refresh();
                setSeverity("error");
                setMessage(error.response.data ? error.response.data.message : "Error occured while changing cart quantity");
                setOpenBar(true);
                setCartDisabled(false);
            });
    }

    function decreaseCart() {
        setCartDisabled(true);

        // Add one at a time
        let newProduct = product;
        newProduct.quantity = 1;

        CartService.removeFromCart(newProduct)
            .then(() => {
                if (quantity === 1)
                    handlers.removeCartItem(product.id)
                else {
                    handlers.changeQuantity(product.id, quantity - 1)
                    setQuantity(quantity => quantity - 1);
                }

                setCartDisabled(false);
                user.refresh();
            })
            .catch((error) => {
                setSeverity("error");
                setMessage(error.response.data ? error.response.data.message : "Error occured while changing cart quantity");
                setOpenBar(true);
                setCartDisabled(false);
                user.refresh();
            });
    }

    const removeProduct = () => {
        setSaveDisabled(true);

        CartService.removeProductFromCart(product.id)
            .then(() => {
                handlers.removeCartItem(product.id);
                setSaveDisabled(false);
                user.refresh();
            })
            .catch((error) => {
                setSeverity("error");
                setMessage(error.response.data ? error.response.data.message : "Error while removing product from cart");
                setOpenBar(true);
                setSaveDisabled(false);
                user.refresh();
            });
    }

    const saveForLater = () => {
        setSaveDisabled(true)
        WishListService.addToWishList(product.id)
            .then(() => {
                CartService.removeProductFromCart(product.id)
                    .then(() => {
                        handlers.removeCartItem(product.id)
                        setSaveDisabled(false)
                        user.refresh();
                    })
                    .catch((error) => {
                        setSeverity("warning");
                        setMessage(error.response.data ? error.response.data.message : "Product added to wishlist.\n Error occured while removing product form cat.");
                        setOpenBar(true);
                        setSaveDisabled(false)
                        user.refresh();
                    });
            })
            .catch(error => {
                setSeverity("error");
                setMessage(error.response.data ? error.response.data.message : "Error while adding product in wishlist");
                setOpenBar(true);
                setSaveDisabled(false)
                user.refresh();
            });
    }

    // Wishlist
    const removeFromWishList = () => {
        setSaveDisabled(true);

        WishListService.removeFromWishList(product.id)
            .then(() => {
                handlers.removeWishlistItem(product.id);
                setRender(false);
                setSaveDisabled(false);
                user.refresh();
            })
            .catch((error) => {
                setSeverity("error");
                setMessage(error.response.data ? error.response.data.message : "Error occured while removing item from quantity");
                setOpenBar(true);
                setSaveDisabled(false);
                user.refresh();
            });

    }

    const addInCart = () => {
        setSaveDisabled(true);

        let newProduct = product;
        newProduct.quantity = 1;

        CartService.addToCart(newProduct)
            .then(() => {
                WishListService.removeFromWishList(product.id)
                    .then(() => {
                        setSaveDisabled(false);
                        handlers.removeWishlistItem(product.id);
                        setRender(false);
                        user.refresh();
                    })
                    .catch(() => {
                        setSeverity("warning");
                        setMessage("Product Added in cart.");
                        setOpenBar(true);
                        setSaveDisabled(false);
                        user.refresh();
                    });

                setCartDisabled(false);
            })
            .catch((error) => {
                setSeverity("error");
                setMessage(error.response.data ? error.response.data.message : "Error occured adding item to quantity");
                setOpenBar(true);
                setSaveDisabled(false);
                user.refresh();
            });
    }

    // Snackbar
    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return;

        setOpenBar(false);
        setSeverity("info");
    };

    // Init
    useEffect(() => {
        // When out of stock disable button
        if (user.details.get)
            if (cart && !product.isStockAvailable)
                handlers.setCanCheckout(false);
    }, [cart, handlers, product.isStockAvailable]);

    if (render) {
        return (
            <Stack
                component={Paper}
                direction="row"
                variant={outlined ? "outlined" : undefined}
                sx={{p: 1}}
            >
                <Snackbar open={openBar} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={severity} sx={{width: '100%'}}>
                        {message}
                    </Alert>
                </Snackbar>
                <Stack sx={{flexGrow: 1, p: 1, justifyContent: 'space-between'}}>
                    <Box
                        sx={{
                            width: "70%",
                            "display": "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: wishlist || history ? 1 : 2,
                            "overflow": "clip",
                            textOverflow: "ellipsis",
                        }}
                    >
                        <Link to={`/product/${product.id}`} style={{textDecoration: 'none'}}>
                            <Typography
                                variant={history ? "body1" : "subtitle1"}
                                sx={{
                                    color: 'primary.dark',
                                    textDecoration: 'none',
                                    textTransform: 'capitalize',
                                    ":hover": {
                                        textDecoration: 'underline',
                                    }
                                }}
                            >
                                {product.name}
                            </Typography>
                        </Link>
                    </Box>
                    <Stack direction="row">
                        <Stack
                            sx={{flexGrow: 1}}
                            direction={history ? "row" : "column"}
                        >
                            <Stack
                                direction="row"
                                sx={{
                                    alignItems: 'center'
                                }}
                            >
                                <Typography variant="subtitle2">
                                    Price: <strong> {product.price.toLocaleString('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                })}
                                </strong>
                                </Typography>
                                {
                                    wishlist &&
                                    <Tooltip title="Add to Cart">
                                        <IconButton
                                            disabled={saveDisabled}
                                            sx={{ml: 2}}
                                            onClick={addInCart}
                                        >
                                            <ShoppingCart fontSize="small"/>
                                        </IconButton>
                                    </Tooltip>
                                }
                            </Stack>
                            {
                                order &&
                                <Box
                                    sx={{ml: history ? 5 : 0}}
                                >
                                    <Typography variant="subtitle2">
                                        Quantity: <b>{quantity}</b>
                                    </Typography>
                                </Box>
                            }
                            {
                                cart &&
                                <>
                                    <Stack
                                        direction="row"
                                        sx={{
                                            alignItems: 'center',
                                            mt: 1
                                        }}
                                    >
                                        <Stack direction="row" spacing={1} sx={{alignItems: 'center'}}>
                                            <Tooltip title="Remove 1 item from Cart">
                                                <IconButton
                                                    disabled={cartDisabled}
                                                    sx={{width: 25, height: 25}}
                                                    onClick={decreaseCart}
                                                >
                                                    <Remove/>
                                                </IconButton>
                                            </Tooltip>
                                            <TextField
                                                value={quantity}
                                                disabled
                                                size="small"
                                                sx={{
                                                    minWidth: 50,
                                                    maxWidth: 40,
                                                    p: 0,
                                                    m: 0,
                                                }}
                                            />
                                            <Tooltip title="Add 1 item to Cart">
                                                <IconButton
                                                    disabled={cartDisabled}
                                                    sx={{width: 25, height: 25}}
                                                    onClick={increaseCart}
                                                >
                                                    <Add/>
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                        <Tooltip title="Save Item in Wishlist">
                                            <IconButton
                                                disabled={saveDisabled}
                                                sx={{ml: 2}}
                                                onClick={saveForLater}
                                            >
                                                <Favorite fontSize="small"/>
                                            </IconButton>
                                        </Tooltip>
                                        {
                                            AuthService.getUserDetails() ? (
                                                !product.isStockAvailable &&
                                                <Typography variant="body2" color="error">
                                                    Out of Stock
                                                </Typography>
                                            ) : (
                                                product.quantity <= product.stock &&
                                                <Typography variant="body2" color="error">
                                                    Out of Stock
                                                </Typography>
                                            )
                                        }
                                    </Stack>
                                </>
                            }
                        </Stack>
                        {
                            (cart || order) &&
                            <Box
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'flex-end'
                                }}
                            >
                                <Typography variant="subtitle2">
                                    SubTotal: <b>{(product.price * quantity).toLocaleString('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                })}</b>
                                </Typography>
                            </Box>
                        }
                    </Stack>
                </Stack>
                <Stack
                    sx={{
                        width: wishlist || history ? 60 : 150,
                        height: wishlist || history ? 70 : 170,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        component='img'
                        src={`${client.defaults.baseURL}/products/image/${product.id}`}
                        sx={{
                            p: 2,
                            height: wishlist || history ? 90 : 150,
                            width: wishlist || history ? 90 : 150,
                            objectFit: "scale-down"
                        }}/>
                </Stack>
                {
                    (wishlist || cart) &&
                    <Stack sx={{justifyContent: 'space-between'}}>
                        <Tooltip title={"Remove Item from " + (cart ? "Cart" : "Wishlist")}>
                            <IconButton
                                disabled={saveDisabled}
                                onClick={cart ? removeProduct : removeFromWishList}
                            >
                                <Close/>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                }
            </Stack>
        );
    }
    return null;
};

export default ProductListCard;
