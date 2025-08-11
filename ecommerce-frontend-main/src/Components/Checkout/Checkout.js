import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {ThemeProvider} from '@mui/material/styles';
import AddressForm from './AddressForm';
import Review from './Review';
import {useNavigate} from 'react-router-dom';
import useTheme from "@mui/material/styles/useTheme";
import {CheckOutContext} from "../../Context/CheckOutContext";
import Stack from "@mui/material/Stack";
import OrderService from "../../api/OrderService";
import PaymentWindow from "./PaymentWindow";
import Copyright from "../Commons/Copyright";
import OrderStatus from "./OrderStatus";
import LoadingButton from "@mui/lab/LoadingButton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import client from "../../api/HttpClient";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Divider from "@mui/material/Divider";
import CartService from "../../api/CartService";
import {UserContext} from "../../Context/UserContext";

// TODO Try completed payment status step
const steps = ['Select Address', 'Review your order', "Process Payment", "Order Status"];

// Checkout component
export default function Checkout() {
    // theme
    const theme = useTheme();

    // Routing
    const navigate = useNavigate();

    // Context
    const checkout = useContext(CheckOutContext);
    const user = useContext(UserContext);

    // states
    const [activeStep, setActiveStep] = useState(0);
    const [razorpayId, setRazorpayId] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(<div/>);
    const [isLoading, setIsLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("info");
    const [open, setOpen] = useState(false);

    // Cleaning
    const cleanCheckout = () => {
        checkout.clear();
        sessionStorage.removeItem('co');
    };

    // RazorPay Handler Method
    // Success
    const handleSuccess = response => {
        // disable button
        checkout.checked.set(true);
console.log(response);
        // Update payment details
        OrderService.updatePaymentDetail({
            transactionId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            paid: true
        })
            .then((result) => {
                // for invoice
                const newResponse = {
                    ...response,
                    order_id: result
                }

                setActiveStep(3);
                setPaymentStatus(<OrderStatus success={newResponse}/>);
            })
            .catch(() => {
                setActiveStep(3);
                setPaymentStatus(<OrderStatus awaiting={response}/>);
            });

        cleanCheckout();
    };

    // Failure
    const handleFailure = response => {
        // disable button
        checkout.checked.set(true);

        // Update payement details
        OrderService.updatePaymentDetail({
            transactionId: response.error.metadata.payment_id,
            razorpayOrderId: response.error.metadata.order_id,
            paid: false
        })
            .then(() => {
                setActiveStep(3);
                setPaymentStatus(<OrderStatus failed={response.error.metadata}/>);
            })
            .catch(() => {
                setActiveStep(3);
                setPaymentStatus(<OrderStatus awaiting={response.error.metadata}/>);
            });
        cleanCheckout();
    };

    const razorPayHandlers = {
        success: handleSuccess,
        failure: handleFailure,
    }

    // Render component based on step
    function getStepContent(step) {
        // Change content
        switch (step) {
            case 0:
                return <AddressForm setDisabled={setButtonDisabled}/>;
            case 1:
                return <Review/>;
            case 2:
                return <PaymentWindow orderId={razorpayId} handlers={razorPayHandlers}/>
            case 3:
                return paymentStatus;
            default:
                throw new Error('Unknown step');
        }
    }

    // Checkout process
    function processCheckout() {
        // Create a order
        OrderService.createOrder({
            products: checkout.products.get,
            billingAddressId: checkout.billing.get.id,
            shippingAddressId: checkout.address.get.id,
        })
            .then(async ({razorpayOrderId}) => {

                // Set razorpayID
                await setRazorpayId(razorpayOrderId);

                // Switch to payment step
                setActiveStep(2);

                if (sessionStorage.getItem('co') === "cart") {
                    localStorage.removeItem('cart');
                    CartService.emptyCart();
                    user.refresh();
                }

                //stop animation
                setIsLoading(false);
            })
            .catch(error => {
                // Show Error
                console.log("Getting error")
                setSeverity('error');
                setMessage(error.response.data ? error.response.data.message : "Failed to create order.");
                setOpen(true);

                //stop animation
                setIsLoading(false);
            })
    }

    // Navigation Handler
    const handleNext = () => {
        // start animation
        setIsLoading(true);

        switch (activeStep) {
            case 0:
                if (activeStep === 0 && !checkout.address.get?.id){

                    setSeverity('error');
                    setMessage("Please Select Address");
                    setOpen(true);
                } else
                    setActiveStep(1);

                //stop animation
                setIsLoading(false);
                break;
            case 1:
                processCheckout()
                break;
            default:
                throw new Error('Unknown step');
        }
    }

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const handleCancel = () => {
        if (sessionStorage.getItem('co') === 'cart') {
            // if tried checking out from cart
            navigate('/cart');
            sessionStorage.removeItem('co');
        } else if (sessionStorage.getItem('co') === null) {
            // unauthorized
            navigate('/');
        } else if (sessionStorage.getItem('co').length > 0) {
            // if tried checking out using (Buy Now)
            navigate(`/product/${sessionStorage.getItem('co')}`);
            sessionStorage.removeItem('co');
        } else
            // unauthorized
            navigate('/');

        cleanCheckout();
    }

    useEffect(() => {
        // authorized access (If refreshed page during checkout)
        if (checkout.products.get.length < 1) {
            handleCancel();
        }
    }, []);

    // Snackbar
    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return;

        setOpen(false);
        setSeverity("info");
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} sx={{width: '100%'}}>
                    {message}
                </Alert>
            </Snackbar>
            <Container component="main" maxWidth="xl" sx={{mb: 1}}>
                <Paper variant="outlined" sx={{my: {xs: 1, md: 3}, p: {xs: 2, md: 3}}}>
                    <Stack
                        direction="row"
                        sx={{
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexGrow: 1
                        }}
                    >
                        <Box
                            component="img"
                            src={`${client.defaults.baseURL}/orders/invoice/image/logo.png`}
                            alt="Ezzy Buy Logo"
                            sx={{
                                width: 'auto',
                                objectFit: 'scale-down',
                                height: 72
                            }}
                        />
                        <Typography component="h1" variant="h4" align="center">
                            Checkout
                        </Typography>
                        <Avatar sx={{m: 1, bgcolor: 'primary.main'}}>
                            <LockOutlinedIcon/>
                        </Avatar>
                    </Stack>
                    <Divider sx={{my: 1}}/>
                    <Stepper activeStep={activeStep} sx={{pt: 3, pb: 5}}>
                        {
                            steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))
                        }
                    </Stepper>
                    <>
                        {/*Main Components*/}
                        {getStepContent(activeStep)}

                        {/*Buttons*/}
                        <Box
                            sx={{
                                display: activeStep < 2 ? 'flex' : 'none',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                            }}
                        >
                            {/* Cancel Button*/}
                            <Stack
                                direction="row"
                                sx={{
                                    justifyContent: 'flex-start',
                                    mx: 5,
                                    alignItems: 'center'
                                }}
                            >
                                <Button onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </Stack>
                            {activeStep !== 0 && (
                                <Button
                                    onClick={handleBack}
                                    sx={{mx: 5}}
                                    variant="outlined"
                                >
                                    Back
                                </Button>
                            )}
                            <Box sx={{display: 'block'}}>
                                <LoadingButton
                                    onClick={handleNext}
                                    loading={isLoading}
                                    disabled={buttonDisabled}
                                    loadingPosition="start"
                                    variant="contained"
                                    size="small"
                                    sx={{
                                        width: 180,
                                        p: 1
                                    }}
                                >
                                    {activeStep === 1 ? 'Place order' : 'Next'}
                                </LoadingButton>
                            </Box>
                        </Box>
                    </>
                </Paper>
                <Copyright/>
            </Container>
        </ThemeProvider>
    );
}