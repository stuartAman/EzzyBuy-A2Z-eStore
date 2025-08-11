import React, {useEffect, useState} from 'react';
import ProductListCard from "../Commons/ProductListCard";
import WishListService from "../../api/WishListService";
import {Box, Stack} from '@mui/material';
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";

const Wishlist = () => {
    // States
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Init
    useEffect(() => {
        WishListService.getWishList()
            .then(wishlist => {
                setLoading(false);
                setWishlistItems(wishlist);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    // Handlers
    // Remove item from cart
    const removeWishlistItem = product_id => {
        setWishlistItems(wishlistItems.filter(item => item.id !== product_id));
    };

    return (
        <>
            {
                loading ? (
                    <Stack
                        direction="row"
                        sx={{
                            p: 1,
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            flexGrow: 1
                        }}
                    >
                        <CircularProgress/>
                    </Stack>
                ) : wishlistItems.length > 0 ? (
                    <Stack
                        sx={{
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            px: 30,
                            pt: 2,
                            flexGrow: 1

                        }} spacing={5}
                        direction='row'>
                        <Stack
                            spacing={2}
                            sx={{
                                alignItems: 'center',
                                justifyContent: 'center', flexGrow: 1
                            }}
                        >
                            {
                                wishlistItems.length > 0 ? (
                                    wishlistItems.map((product, idx) =>
                                        <Box width='100%' sx={{px: 2}} key={idx}>
                                            <ProductListCard product={product} handlers={{removeWishlistItem}}
                                                             wishlist/>
                                        </Box>
                                    )) : ("Wishlist is empty")

                            }
                        </Stack>
                    </Stack>
                ) : (
                    <Stack
                        direction="row"
                        sx={{
                            p: 1,
                            alignItems: 'center',
                            justifyContent: 'center', flexGrow: 1
                        }}
                    >
                        <Typography variant="h5">
                            Your wishlist is empty. <Link to={'/'}>Continue Shopping</Link>
                        </Typography>
                    </Stack>
                )
            }
        </>
    );
};

export default Wishlist;
