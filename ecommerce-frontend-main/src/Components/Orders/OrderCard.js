import React, {useCallback, useEffect, useState} from 'react';
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ProductListCard from "../Commons/ProductListCard";
import Chip from "@mui/material/Chip";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {Box} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import OrderService from "../../api/OrderService";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const OrderCard = ({order}) => {
    // States
    const [loading, setLoading] = useState(false);
    const [noInvoice, setNoInvoice] = useState(false);
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);

    // Get order status chip
    const getOrderStatus = useCallback((orderStatus) => {
        switch (orderStatus) {
            case "PAYMENT_PENDING":
                return <Chip size="small" label="Payment Pending" color="warning" variant="outlined"/>;
            case "FAILED":
                return <Chip size="small" label="Failed" color="error" variant="outlined"/>;
            case "PLACED":
                return <Chip size="small" label="Placed" color="primary" variant="outlined"/>;
            case "INTRANSIT":
                return <Chip size="small" label="In Transit" color="info" variant="outlined"/>;
            case "DELIVERED":
                return <Chip size="small" label="Delivered" color="success" variant="outlined"/>;
            default:
                return <Chip size="small" label="ERROR" color="error" variant="outlined"/>;
        }
    }, []);

    // Invoice
    const downloadInvoice = useCallback(() => {
        // Animations
        setLoading(true);

        OrderService.getOrderInvoice({orderId: order.id})
            .then(async (invoice) => {
                // Create a url for pdf file
                let file = new Blob([invoice], {type: 'application/pdf'});
                let invoiceURL = URL.createObjectURL(file);

                // Open invoice in new tab
                await window.open(invoiceURL, `INVOICE_${order.id}`);
                setLoading(false)
            })
            .catch(error => {
                setMessage(error.response.data ? error.response.data.message : "Error getting invoice.");
                setOpen(true);
                setLoading(false);
            });
    }, [order.id])

    useEffect(() => {
        // Invoice button disable
        switch (order.orderStatus) {
            case "PAYMENT_PENDING":
            case "FAILED":
                setNoInvoice(true);
                break;
            default:
                setNoInvoice(false);
        }
    }, [order.orderStatus]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return;

        setOpen(false);
    };

    return (
        <Paper sx={{width: "100%", p: 1,}}>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                    {message}
                </Alert>
            </Snackbar>
            <Stack
                direction="row"
                sx={{
                    flexGrow: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 2,
                    mb: 0.5
                }}
            >
                <Typography variant="caption">
                    <b>Order Id</b> : {order.id}
                </Typography>
                <Typography variant="caption">
                    <b>Status</b> : {getOrderStatus(order.orderStatus)}
                </Typography>
            </Stack>
            <Stack spacing={0.1}>
                {
                    order.itemList.map((product, idx) => <ProductListCard key={idx} product={product} outlined order
                                                                          history/>)
                }
            </Stack>
            <ListItem sx={{py: 1, px: 1}}>
                <ListItemText primary={<Typography variant="body1">Order Total</Typography>}/>
                <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                    {order.orderAmount.toLocaleString('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                    })}
                </Typography>
            </ListItem>
            <Stack
                direction="row"
                sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 1,
                    mt: -1
                }}
            >
                <Box>
                    <Typography variant="caption">
                        <b>Order Date</b> : {new Date(order.orderDate).toLocaleDateString('en-IN')}
                    </Typography>
                </Box>
                <Box>
                    <LoadingButton
                        disabled={noInvoice}
                        size={"small"}
                        sx={{flexGrow: 1}}
                        loading={loading}
                        onClick={downloadInvoice}
                    >
                        <Typography variant="caption">
                            Download Invoice
                        </Typography>
                    </LoadingButton>
                </Box>
            </Stack>
        </Paper>
    );
};

export default OrderCard;
