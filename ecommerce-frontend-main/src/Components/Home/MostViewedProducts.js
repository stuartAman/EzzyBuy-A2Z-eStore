import React, {useEffect, useState} from 'react';
import Stack from "@mui/material/Stack";
import ProductService from "../../api/ProductService";
import ProductCard from "../Commons/ProductCard";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Carousel, {consts} from "react-elastic-carousel";
import useTheme from "@mui/material/styles/useTheme";

const MostViewedProducts = () => {
    const theme = useTheme();

    // Carousel
    const breakPoints = [
        {width: 0, itemsToShow: 1, itemsToScroll: 1},
        {width: 420, itemsToShow: 2, itemsToScroll: 2},
        {width: 640, itemsToShow: 3, itemsToScroll: 3},
        {width: 840, itemsToShow: 4, itemsToScroll: 4},
        {width: 1080, itemsToShow: 5, itemsToScroll: 5},
        {width: 1280, itemsToShow: 6, itemsToScroll: 6},
        {width: theme.breakpoints.values.xl, itemsToShow: 7},
    ];

    // Products
    const [products, setProducts] = useState(null);
    const [errorData, setErrorData] = useState(null);

    const getProducts = () => {
        // For Loading
        setProducts(null);
        setErrorData(null);

        // Product Request
        ProductService.getMostViewedProducts()
            .then((newProducts) => {
                setProducts(newProducts);
            })
            .catch(error => {
                setErrorData({
                    message: error.message,
                    statusCode: error.statusCode
                });
            })

    };

    // Init
    useEffect(() => {
        getProducts();
    }, []);

    return (
        <>
            <Typography variant="h6" gutterBottom>Most Popular Products</Typography>
            <Stack
                direction="row"
                spacing={2}
                sx={{
                    justifyContent: "space-around",
                    alignItems: 'center',
                }}
            >
                {
                    !products && !errorData &&
                    <CircularProgress sx={{m: 5}}/>
                }
                {
                    products &&
                    <Carousel
                        isRTL={false}
                        itemsToShow={6}
                        renderPagination={() => <></>}
                        renderArrow={({type, onClick, isEdge}) => {
                            const arrow = type === consts.PREV ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>;
                            return (
                                <Stack justifyContent="center">
                                    <IconButton sx={{width: 50, height: 50}} onClick={onClick} disabled={isEdge}>
                                        {arrow}
                                    </IconButton>
                                </Stack>
                            );
                        }}
                        breakPoints={breakPoints}
                        itemPadding={[10, 50]}
                    >
                        {products.map((product, idx) => <ProductCard key={idx} product={product}/>)}
                    </Carousel>
                }
                {
                    errorData &&
                    <Alert severity="error" sx={{m: 2, flexGrow: 1}}>
                        <AlertTitle>Error : <strong>{errorData.statusCode}</strong></AlertTitle>
                        {errorData.message} — <strong onClick={() => getProducts()}>Reload</strong>
                    </Alert>
                }
            </Stack>
        </>
    );
};

export default MostViewedProducts;