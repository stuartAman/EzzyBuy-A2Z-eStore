import * as React from 'react';
import {useContext} from 'react';
import Typography from '@mui/material/Typography';
import {Box, Stack} from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import {CheckOutContext} from "../../Context/CheckOutContext";
import ProductListCard from "../Commons/ProductListCard";
import Container from "@mui/material/Container";

export default function Review() {
    // Context
    const checkout = useContext(CheckOutContext);

    React.useEffect(() => {
        // Already calculated total
        if (checkout.total.get > 0) return;

        // Calculate subtotal
        checkout.products.get.forEach(product => {
            checkout.total.set(prevPrice => prevPrice + (product.price * product.quantity));
        });
    }, []);

    return (
        <>
            <Container maxWidth="md" sx={{p: 3}}>
                <Typography variant="h6" gutterBottom>
                    Order summary
                </Typography>
            </Container>
            <Box sx={{mb: 2}}>
                {/*Product List*/}
                <Container maxWidth="md" sx={{p: 3}}>
                    <Stack spacing={2}>
                        {checkout.products.get.map((product) => <ProductListCard product={product} order/>)}
                    </Stack>
                </Container>

                {/*Total*/}
                <Container maxWidth="md">
                    <ListItem sx={{py: 1, px: 0}}>
                        <ListItemText primary="Total"/>
                        <Typography variant="subtitle1" sx={{fontWeight: 700}}>
                            {
                                checkout.total.get.toLocaleString('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                })
                            }
                        </Typography>
                    </ListItem>
                </Container>

                {/*Addresses*/}
                <Container maxWidth="md">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" gutterBottom sx={{mt: 1}}>
                                Shipping
                            </Typography>
                            <Typography variant="body2" gutterBottom><b>{checkout.address.get.fullName}</b></Typography>
                            <Typography variant="caption">
                                {checkout.address.get.line1 + ", "} {checkout.address.get.line2 && checkout.address.get.line2},
                            </Typography><br/>
                            <Typography variant="caption">
                                {checkout.address.get.landmark && checkout.address.get.landmark + ", "} {checkout.address.get.townCity + ", "} {checkout.address.get.state},
                            </Typography><br/>
                            <Typography variant="caption">
                                {checkout.address.get.pincode + ", "} {checkout.address.get.country + ", "}
                                <b>{checkout.address.get.mobileNumber}</b>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" gutterBottom sx={{mt: 1}}>
                                Billing
                            </Typography>
                            <Typography variant="body2" gutterBottom><b>{checkout.billing.get.fullName}</b></Typography>
                            <Typography variant="caption">
                                {checkout.billing.get.line1 + ", "} {checkout.billing.get.line2 && checkout.billing.get.line2},
                            </Typography><br/>
                            <Typography variant="caption">
                                {checkout.billing.get.landmark && checkout.billing.get.landmark + ", "} {checkout.billing.get.townCity + ", "} {checkout.billing.get.state},
                            </Typography><br/>
                            <Typography variant="caption">
                                {checkout.billing.get.pincode + ", "} {checkout.billing.get.country + ", "}
                                <b>{checkout.billing.get.mobileNumber}</b>
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
}