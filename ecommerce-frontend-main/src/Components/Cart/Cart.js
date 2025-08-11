import React, {useContext, useEffect, useState} from 'react';
import CartService from "../../api/CartService";
import ProductListCard from "../Commons/ProductListCard";
import {Box, Paper, Stack} from '@mui/material';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {Link, useNavigate} from "react-router-dom";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import {CheckOutContext} from "../../Context/CheckOutContext";
import LoadingButton from "@mui/lab/LoadingButton";
import {UserContext} from "../../Context/UserContext";

const Cart = () => {
    // Routing
    const navigate = useNavigate();

    // States
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingCheckout, setLoadingCheckout] = useState(false);
    const [canCheckout, setCanCheckout] = useState(true);

    // Context
    const checkout = useContext(CheckOutContext);
    const user = useContext(UserContext);

    // Handlers
    // Remove item from cart
    const removeCartItem = product_id => {
        setCartItems(cartItems.filter(item => item.id !== product_id));
    };

    // change cart item quantity
    const changeQuantity = (product_id, quantity) => {
        setCartItems(cartItems.map(item => {
            if (item.id === product_id)
                item.quantity = quantity;

            return item;
        }));
    };

    // Checkout
    const proceedToCheckout = () => {
        setLoadingCheckout(true);

        if (user.details.get) {
            // add product to checkout context
            checkout.products.set(cartItems);

            // set path for redirect
            sessionStorage.setItem('co', 'cart');

            // navigate to checkout page
            setLoadingCheckout(false);
            navigate('/checkout')
        } else {
                setLoadingCheckout(false);
                navigate(`/login?ref=/cart`);
            }
        }

    // Init
        useEffect(() => {
            CartService.getShoppingCart()
                .then(cart => {
                    setCartItems(cart);
                    setLoading(false);
                })
                .catch(error => {
                    console.log(error)
                    setLoading(false);
                });
        }, []);

        useEffect(async () => {
            // Checkout availability
            setCanCheckout(true);

            // Recalculate subtotal
            let subtotal = 0;

            await cartItems.forEach((item) => {
                subtotal += item.quantity * item.price;
            });

            checkout.total.set(subtotal)

        }, [cartItems]);

    // To pass handler methods to child
    const handlers = {removeCartItem, changeQuantity, setCanCheckout}

    return (
        <Container sx={{mt: 1}}>
            <Grid container>
                <Grid item sm={9}>
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                            textTransform: 'capitalize'
                        }}
                    >
                        {
                            user.details.get ? (
                                <>{user.details.get.firstname}'s Cart</>
                            ) : (
                                <>Your Cart</>
                            )
                        }
                    </Typography>
                    <Divider sx={{mb: 1}}/>
                    {
                        loading ? (
                            <Stack
                                direction="row"
                                sx={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexGrow: 1
                                }}
                            >
                                    <CircularProgress/>
                                </Stack>
                            ) : cartItems.length > 0 ? (
                                <Stack
                                    spacing={1}
                                    sx={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexGrow: 1,
                                    }}
                                >
                                    {
                                        cartItems.map((product, idx) =>
                                            <Box key={idx} width='100%' sx={{px: 2}}>
                                                <ProductListCard product={product} handlers={handlers} cart/>
                                            </Box>
                                        )
                                    }
                                </Stack>
                            ) : (
                                <Stack
                                    direction="row"
                                >
                                    <Typography variant="h5">
                                        Your cart is empty. <Link to={'/'}>Continue Shopping</Link>
                                    </Typography>
                                </Stack>
                            )
                        }
                    </Grid>
                    <Grid item sm={3}>
                        <Stack
                            direction="row"
                            sx={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexGrow: 1,
                                width: "100%",
                                position: 'sticky',
                                top: "17%"
                            }}
                        >
                            <Paper
                                variant="outlined"
                                sx={{
                                    width: '90%',
                                    p: 2,
                                    m: 1
                                }}
                            >
                                <Stack>
                                    <Typography
                                        variant="h6"
                                        sx={{textWeight: 'bold'}}
                                        gutterBottom
                                    >
                                        Order Summary
                                    </Typography>
                                    <Box sx={{my: 1}}>
                                        <Stack
                                            direction="row"
                                            sx={{
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                px: 1
                                            }}
                                        >
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    textTransform: "capitalize",
                                                    fontWeight: 'bold'
                                                }}>
                                                Items
                                            </Typography>
                                            <Typography variant="subtitle1">
                                                {cartItems.length}
                                            </Typography>
                                        </Stack>
                                        <Stack
                                            direction="row"
                                            sx={{
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                px: 1
                                            }}
                                        >
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    textTransform: "capitalize",
                                                    fontWeight: 'bold'
                                                }}>
                                                Subtotal
                                            </Typography>
                                            <Typography variant="subtitle1">
                                                {checkout.total.get.toLocaleString('en-In', {
                                                    style: 'currency',
                                                    currency: 'INR',
                                                })}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                    <LoadingButton
                                        loading={loadingCheckout}
                                        size="small"
                                        disabled={!canCheckout || cartItems.length <= 0}
                                        variant="contained"
                                        endIcon={<ShoppingCartIcon/>}
                                        onClick={proceedToCheckout}
                                    >
                                        <Typography variant="body1" sx={{textTransform: "capitalize"}}>
                                            Proceed to Buy
                                        </Typography>
                                    </LoadingButton>
                                </Stack>
                            </Paper>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        );
    }
;

export default Cart;
