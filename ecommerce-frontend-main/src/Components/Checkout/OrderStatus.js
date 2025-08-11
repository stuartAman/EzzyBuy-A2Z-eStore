import React from 'react';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import OrderService from "../../api/OrderService";


const OrderStatus = ({success, failed, awaiting}) => {
    //Routing
    const navigate = useNavigate();

    return (
        <Box sx={{p: 2}}
        >
            {
                success &&
                <>
                    <Typography variant="h4" color="success.main" gutterBottom>Payment Succesful</Typography>
                    <Typography>
                        Your order with order id #{success.razorpay_order_id} has been successfully placed.
                    </Typography>
                    <Typography>
                        Payment has been successfully processed with transaction id #{success.razorpay_payment_id}
                    </Typography>
                    <Stack direction="row" alignItems="center" justifyContent="flex-end">
                        <Button
                            onClick={() => {
                                OrderService.getOrderInvoice({orderId: success.order_id})
                                    .then(invoice => {
                                        let file = new Blob([invoice], {type: 'application/pdf'});
                                        let invoiceURL = URL.createObjectURL(file);
                                        window.open(invoiceURL, `INVOICE_${success.order_id}`);
                                    });
                            }}
                        >
                            Download Invoice
                        </Button>
                    </Stack>
                </>
            }
            {
                failed &&
                <>
                    <Typography variant="h4" color="error.main" gutterBottom>Payment Failed</Typography>
                    <Typography>
                        Your order with order id #{failed.order_id} has failed.
                    </Typography>
                </>
            }
            {
                awaiting &&
                <>
                    <Typography variant="h4" color="warning.main" gutterBottom>Awaiting Payment</Typography>
                    <Typography>
                        Awaiting payment from bank.
                    </Typography>
                </>
            }
            <Stack direction="row" justifyContent="flex-end">
                <Button
                    onClick={() => {
                        setTimeout(() => navigate('/'), 1000);
                    }}
                    variant="contained"
                >
                    Done
                </Button>
            </Stack>
        </Box>
    );
};

export default OrderStatus;
