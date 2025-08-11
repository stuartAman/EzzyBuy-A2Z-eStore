import React, {useEffect, useState} from 'react';
import {Container} from "@mui/material";
import OrderService from "../../api/OrderService";
import Stack from "@mui/material/Stack";
import OrderCard from "./OrderCard";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        OrderService.getUserOrders()
            .then((response) => {
                setOrders(response);
                setLoading(false);
            })
            .catch(error => {
                setMessage(error.response ? error.response.data.message : "Error getting order history.");
                setOpen(true);
                setLoading(false);
            })
    }, []);

    // Snackbar
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <Container maxWidth="md">
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                    {message}
                </Alert>
            </Snackbar>
            <Typography variant="h5" gutterBottom>My Orders</Typography>
            <Divider sx={{mb: 1}}/>
            {
                loading ? (
                    <Stack
                        sx={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%'
                        }}
                    >
                        <CircularProgress/>
                    </Stack>
                ) : orders.length > 0 ? (
                    <Stack spacing={2}>
                        {
                            orders.map((order, idx) => <OrderCard key={idx} order={order}/>)
                        }
                    </Stack>
                ) : (
                    <Stack
                        sx={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%'
                        }}
                    >
                        <Typography variant="h2">
                            You have not placed any orders.
                        </Typography>
                    </Stack>
                )
            }
        </Container>
    );
};

export default Orders;
