import {
    Box,
    Button,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import ProductService from "../../api/ProductService";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from 'react';
import client from "../../api/HttpClient";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import AuthService from "../../api/AuthService";
import {CheckOutContext} from "../../Context/CheckOutContext";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import WishListService from "../../api/WishListService";
import CartService from "../../api/CartService";
import Tooltip from "@mui/material/Tooltip";
import LoadingButton from "@mui/lab/LoadingButton";
import {UserContext} from "../../Context/UserContext";


const ProductPage = () => {
    // Theme
    const ThemeButton = createTheme({
        palette: {
            primary: {
                main: "#b71c1c"
            }
        }
    });

    const ThemeIncl = createTheme({
        palette: {
            primary: {
                main: "#9e9e9e"
            }
        }
    });

    // Context
    const checkout = useContext(CheckOutContext);
    const user = useContext(UserContext);

    // Routing
    const navigate = useNavigate();
    const params = useParams()
    const location = useLocation();

    // States
    const [productDetails, setProductDetails] = useState(null);
    // wishlist
    const [wishlistIcon, setWishlistIcon] = useState(<FavoriteBorder/>);
    const [wishlistButtonState, setWishlistButtonState] = useState(false);
    // buy
    const [buyButtonState, setBuyButtonState] = useState(false);
    const [cartAlert, setCartAlert] = useState("");
    const [cartButtonState, setCartButtonState] = useState(false);
    const [cartAlertSeverity, setCartAlertSeverity] = useState("info");
    // Error
    const [productError, setProductError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Product details handler
    const getProductDetails = () => {
        return ProductService.getProductDetails(params.product_id)
            .then((result) => {
                setProductDetails(result);
                return result;
            });
    }

    // Wishlist handler
    const toggleWishList = () => {
        // Authenticated user
        if (user.details.get) {
            // disable button
            setWishlistButtonState(true);

            if (WishListService.productInWishlist(productDetails.id)) {
                // Remove to wishlist
                WishListService.removeFromWishList(productDetails.id)
                    .then(() => {
                        setWishlistIcon(<FavoriteBorder/>)
                        setWishlistButtonState(false);
                        user.refresh();
                    })
                    .catch(() => {
                        user.refresh();
                        setWishlistButtonState(false);
                    });
            } else {
                // Add to wishlist
                WishListService.addToWishList(productDetails.id)

                    .then(() => {
                        setWishlistIcon(<Favorite sx={{color: ThemeButton.palette.primary.main}}/>);
                        setWishlistButtonState(false);
                        user.refresh();
                    })
                    .catch(() => {
                        user.refresh();
                        setWishlistButtonState(false);
                    });
            }
        } else {
            // User Login Page
            navigate(`/login?ref=${location.pathname}`)
        }
    }

    // Cart Handlers
    const addToCart = () => {
        // Disable Button
        setCartButtonState(true);

        // Set Qauntity to 1
        productDetails.quantity = quantity;

        // Add product to cart
        CartService.addToCart(productDetails)
            .then(response => {
                // show success alert
                setCartAlertSeverity("success");
                setCartAlert(response.data ? response.data.message : "Successfully added product to cart.");
                setTimeout(() => setCartAlert(""), 10000);

                // Enable Button
                setCartButtonState(false);
                user.refresh();
            })
            .catch((error) => {
                // show failed alert
                console.log(error);
                console.log(error.response);
                setCartAlertSeverity("error");
                setCartAlert(error.response.data ? error.response.data.message : "Failed to add item to cart.");
                setTimeout(() => setCartAlert(""), 10000);

                // Enable Button
                setCartButtonState(false);
            });
    }

    // load wish state on init
    const init = new BroadcastChannel('wishProduct')
    init.addEventListener('message',
        () => {
            if (productDetails) {
                // wishlist check
                if (WishListService.productInWishlist(productDetails.id))
                    setWishlistIcon(<Favorite sx={{color: ThemeButton.palette.primary.main}}/>);

                // Stock Check
                if (productDetails.stock < 1)
                    setBuyButtonState(true);
            }
        }, false)

    // init
    useEffect(() => {
        // Product details
        getProductDetails()
            .then(() => {
                init.postMessage('run');
            })
            .catch(() => {
                setProductError({message: "Failed to load product details"})
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Stack
            direction="row"
            spacing={5}
            sx={{
                justifyContent: 'space-around',
                flexGrow: 1,
                alignItems: 'flex-start',
                display: 'flex',
                px: 5,
                py: 2
            }}
        >
            {
                productDetails &&
                <>
                    {/*Product Image*/}
                    <Box
                        sx={{
                            minWidth: '40vw',
                            maxWidth: '40vw',
                            minHeight: '80vh',
                            maxHeight: '80vh',
                            position: "-webkit-sticky"
                        }}
                    >
                        <Paper
                            sx={{
                                p: 3,
                                width: '100%',
                                height: '80vh',
                            }}
                        >
                            <Stack
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Box
                                    component="img"
                                    src={`${client.defaults.baseURL}/products/image/${productDetails.id}`}
                                    sx={{
                                        width: "100%",
                                        height: '100%',
                                        objectFit: "scale-down"
                                    }}
                                />
                            </Stack>
                        </Paper>
                    </Box>

                    {/*Product Description*/}
                    <Box
                        sx={{
                            textAlign: 'left',
                            minWidth: '30vw',
                            maxWidth: '60vw',
                            maxHeight: '90vh',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            overflowY: 'scroll',
                            msOverflowStyle: 'none',
                            px: 3,
                            "::-webkit-scrollbar": {
                                display: 'none'
                            }
                        }}
                    >
                        <Stack
                            direction="row"
                        >
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    flexGrow: 1,
                                    paddingRight: 5,
                                }}
                            >
                                {productDetails.name}
                            </Typography>
                            <Tooltip title="Add to Wishlist">
                                <IconButton
                                    sx={{
                                        p: 2,
                                        width: 10,
                                        height: 10,
                                    }}
                                    disabled={wishlistButtonState}
                                    onClick={toggleWishList}
                                >
                                    {wishlistIcon}
                                </IconButton>
                            </Tooltip>
                        </Stack>
                        <Typography variant="h4" sx={{mt: 1, fontWeight: "bold"}}>
                            {productDetails.price.toLocaleString('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                            })}
                        </Typography>
                        <ThemeProvider theme={ThemeIncl}>
                            <Typography gutterBottom sx={{color: "primary.main", textTransform: "capitalize", mb: 1}}>
                                inclusive of all taxes
                            </Typography>
                        </ThemeProvider>
                        <Button
                            variant="contained"
                            endIcon={<StarIcon/>}
                            color="success"
                            size="small"
                            disableElevation
                            disableRipple
                            sx={{mt: 2}}
                        >
                            {productDetails.rating}
                        </Button>
                        <Box width='75px'
                             sx={{
                                 mt: 2,
                                 mb: 2
                             }}>
                            <TextField
                                label='Qty'
                                select
                                disabled={productDetails.stock < 1}
                                size="small"
                                fullWidth
                                value={quantity}
                                onChange={(event) => {
                                    setQuantity(event.target.value);
                                }}
                            >
                                {
                                    [...Array(productDetails.stock > 10 ? 10 : productDetails.stock > 0 ? productDetails.stock : 1).keys()].map((numb, idx) => {
                                        return <MenuItem key={idx} value={numb + 1}>{numb + 1}</MenuItem>
                                    })
                                }
                            </TextField>
                        </Box>

                        {
                            productDetails.stock < 5 && productDetails.stock > 0 &&
                            <Alert icon={false} severity="warning" sx={{mb: -1, mt: 1, maxWidth: 300, minWidth: 200}}>
                                Remaining in Stock : {productDetails.stock}
                            </Alert>
                        }

                        {
                            productDetails.stock === 0 &&
                            <Alert icon={false} severity="error" sx={{mb: -1, mt: 1, maxWidth: 300, minWidth: 200}}>
                                Out of Stock
                            </Alert>
                        }
                        <ThemeProvider theme={ThemeButton}>
                            <Stack
                                direction="row"
                                spacing={2}
                                display="block"
                                sx={{my: 3}}
                            >
                                <Button
                                    variant="contained"
                                    endIcon={<ShoppingCartIcon/>}
                                    onClick={() => {
                                        // validate user to checkout else Login
                                        if (AuthService.getUserDetails()) {
                                            // set single quantity
                                            productDetails.quantity = quantity;

                                            // for failed redirection
                                            sessionStorage.setItem('co', productDetails.id);

                                            // set context details & navigate
                                            checkout.products.set([productDetails]);
                                            navigate(`/checkout`);
                                        } else {
                                            navigate(`/login?ref=/product/${productDetails.id}`);
                                        }
                                    }}
                                    disabled={buyButtonState}
                                >
                                    Buy Now
                                </Button>
                                <LoadingButton
                                    variant="outlined"
                                    endIcon={<AddShoppingCartIcon/>}
                                    onClick={addToCart}
                                    loading={cartButtonState}
                                    disabled={buyButtonState}
                                >
                                    Add to Cart
                                </LoadingButton>
                            </Stack>
                            {
                                cartAlert &&
                                <Alert severity={cartAlertSeverity} sx={{flexShrink: 1, flexGrow: 1, mb: 2}}>
                                    {cartAlert}
                                </Alert>
                            }
                        </ThemeProvider>
                        <Typography variant="subtitle1" sx={{fontWeight: "bold"}} gutterBottom>Description</Typography>
                        <Typography variant="body2" gutterBottom sx={{mb: 5}}>
                            <> {Object.values(productDetails.description)} </>
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell colSpan={2}>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{fontWeight: "bold"}}
                                            >
                                                Highlights
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        Object.keys(productDetails.additionalDetails).map((key, idx) => (
                                            <TableRow
                                                key={idx}
                                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                            >
                                                <TableCell
                                                    sx={{
                                                        textTransform: 'capitalize'
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{fontWeight: "bold"}}
                                                    >
                                                        {key}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {productDetails.additionalDetails[key]}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </>
            }
            {
                !productDetails && !productError &&
                < Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={!productDetails}
                >
                    <CircularProgress color="inherit"/>
                </Backdrop>
            }
            {
                !productDetails && productError &&
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {productError.message} -
                    <strong
                        onClick={(() => {
                            setProductError(null);
                            getProductDetails();
                        })}
                    >
                        Reload
                    </strong>
                </Alert>
            }
        </Stack>
    );
};

export default ProductPage;
