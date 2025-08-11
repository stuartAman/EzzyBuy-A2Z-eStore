import React, {useCallback, useContext, useEffect, useState} from 'react';
import {CheckOutContext} from "../../Context/CheckOutContext";
import useTheme from "@mui/material/styles/useTheme";
import {Box} from "@mui/material";
import Button from "@mui/material/Button";
import AuthService from "../../api/AuthService";
import Stack from "@mui/material/Stack";

const PaymentWindow = ({orderId, handlers}) => {
    // Context
    const checkout = useContext(CheckOutContext);

    // Theme
    const theme = useTheme();

    // States
    let [reload, setReload] = useState(Date.now());
    // load script
    const loadScript = (src) => {
        return new Promise((resolve) => {
            // Create Script element
            const script = document.createElement("script");
            script.src = src;

            // Try loading script
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };

            // Load script in element
            document.getElementById('paymentWindow').innerHTML = "";
            document.getElementById('paymentWindow').appendChild(script);
        });
    }

    // Load payment window
    const displayRazorpay = useCallback(
        async (options) => {
            const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

            if (!res) {
                alert("Razorpay SDK failed to load. Are you online?");
                return;
            }

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
            paymentObject.on('payment.failed', handlers.failure);
        },
        [reload],
    );

    useEffect(async () => {
        // User Details
        const user = await AuthService.getUserDetails();
        console.log(checkout);
        // Options
        const options = {
            "key": "rzp_test_VVOzaRtoIXQGUP",
            "amount": Math.round(checkout.total.get * 100),
            "currency": "INR",
            "name": "EZZY BUY",
            "description": "Please select your payment method.",
            "order_id": orderId,
            "handler": handlers.success,
            "prefill": {
                "name": user.name,
                "email": user.email,
                "contact": checkout.billing.get.mobileNumber
            },
            "notes": {
                "address": "Opposite Laxmi Chit Fund"
            },
            "theme": {
                "color": theme.palette.primary.main
            },
            "modal": {
                "confirm_close": true
            },
            "retry": {
                "enabled": false
            }
        };

        // Display razorpay window
        displayRazorpay(options);
    }, [reload, checkout.total.get]);

    return (
        <>
            <Box id="paymentWindow"/>
            <Stack
                direction="row"
                component="div"
                sx={{
                    alignItem: 'center',
                    justifyContent: "space-around"
                }}
            >
                <Button
                    disabled={checkout.checked.get}
                    onClick={() => {
                        // Crate response
                        const response = {
                            error: {
                                metadata: {payment_id: "CANCELED", orderId}
                            }
                        };

                        // call fail handler
                        handlers.failure(response);
                    }}
                    sx={{mx: 5}}
                    variant="contained"
                >
                    Cancel
                </Button>
                <Button
                    disabled={checkout.checked.get}
                    onClick={() => setReload(Date.now())}
                    sx={{mx: 5}}
                    variant="contained"
                >
                    Retry
                </Button>
            </Stack>
        </>
    );
};

export default PaymentWindow;
