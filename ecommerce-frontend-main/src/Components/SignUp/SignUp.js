import {Alert, Avatar, Box, Container, CssBaseline, Grid, Stack, TextField, Typography} from "@mui/material"
import {ThemeProvider} from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CloseIcon from '@mui/icons-material/Close';
import React, {useState} from "react";
import AuthService from "../../api/AuthService";
import IconButton from "@mui/material/IconButton";
import {Link as RouterLink, useNavigate, useSearchParams} from "react-router-dom";
import useTheme from "@mui/material/styles/useTheme";
import LoadingButton from "@mui/lab/LoadingButton";
import Copyright from "../Commons/Copyright";
import Snackbar from "@mui/material/Snackbar";

const SignUp = () => {
    // Theme context object
    const theme = useTheme();

    // State
    const [firstName, setFirstName] = useState('');
    const [firstNameHelperText, setFirstNameHelperText] = useState('');
    const [lastName, setLastName] = useState('');
    const [lastNameHelperText, setLastNameHelperText] = useState('');
    const [email, setEmail] = useState('');
    const [emailHelperText, setEmailHelperText] = useState('');
    const [password, setPassword] = useState('');
    const [passwordHelperText, setPasswordHelperText] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordHelperText, setConfirmPasswordHelperText] = useState('');
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState("info");
    const [signInUp, setSignInUp] = useState(false);
    const [searchParams,] = useSearchParams();
    const navigate = useNavigate();


    // Validations
    // validate first name
    function validateFirstName(firstName) {
        // reset error message
        setFirstNameHelperText('');

        if (firstName === "") {
            setFirstNameHelperText("This Field Cannot be Empty")
            return false;
        } else if (firstName.length < 3) {
            setFirstNameHelperText("First name must be at least 3 character long")
            return false;
        }
        return true;
    }

    // validate last name
    function validatLastName(lastName) {
        // reset error message
        setLastNameHelperText('');
        if (lastName === "") {
            setLastNameHelperText("This Field Cannot be empty");
            return false;
        }
        return true;
    }

    // validate email
    function validateEmail(email) {
        // reset error message
        setEmailHelperText('');

        if (!(/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email))) {
            setEmailHelperText("Enter a valid email address");
            return false;
        }
        return true;
    }

    // validate password
    function validatePassword(password) {
        // reset error message
        setPasswordHelperText('');

        if (password.length < 8) {
            setPasswordHelperText("Password length must be at least 8 characters");
            return false;
        } else if (password.length > 32) {
            setPasswordHelperText("Password length must not exceed 32 characters");
            return false;
        } else if (!(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@#$%^&,?~_+-=|]).{8,32}$/.test(password))) {
            setPasswordHelperText("Your password must be contain at least 1 number, 1 uppercase & 1 lowercase character & 1 special character.");
            return false;
        }
        return true;
    }

    // validate confirm password
    function validateConfirmPassword(confirmPassword) {
        // reset error message
        setConfirmPasswordHelperText('');
        if (password === confirmPassword)
            return true;
        else {
            setConfirmPasswordHelperText("Password and Confirm Password field should match");
            return false;
        }
    }

    // Submit form handler
    const submitHandler = (event) => {
        event.preventDefault();

        // Form Data
        let data = new FormData(event.currentTarget)
        data = {
            firstname: data.get('firstName'),
            lastname: data.get('lastName'),
            email: data.get('email'),
            password: data.get('password'),
            confirmPassword: data.get('confirmPassword'),
        }

        // validate all fields
        if (validateFirstName(data.firstname) && validatLastName(data.lastname) && validateEmail(data.email) && validatePassword(data.password) && validateConfirmPassword(data.confirmPassword)) {
            // animations
            setSignInUp(true);
            setMessage("");

            AuthService.register(data)
                .then(() => {
                    // reset fields
                    setFirstName('');
                    setLastName('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');

                    // set alert
                    setSeverity("success");
                    setMessage("You have successfully registered. You will be redirected to Login page shortly.");
                    setOpen(true);
                    setSignInUp(false);

                    // Redirection
                    setTimeout(() => {
                        // check if to redirect
                        if (searchParams.get('ref')) {
                            navigate(`/login?ref=${searchParams.get('ref')}`);
                        } else {
                            // Redirect to Home
                            navigate('/Login');
                        }
                    }, 3000);
                })
                .catch(error => {
                    // Stop loading animation
                    setSignInUp(false);

                    // Set error message
                    let err = error.response ? error.response.data.message : "An error has occured";

                    // Set Alert
                    setSeverity("error");
                    setMessage(err);
                    setOpen(true);
                });
        }
    }

    // Snackbar
    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return;

        setOpen(false);
        setSeverity("info");
    };

    return (
        <ThemeProvider theme={theme}>
            <Stack direction="row"
                   sx={{
                       justifyContent: 'flex-end;',
                       flexGrow: 1,
                   }}
            >
                <IconButton onClick={() => navigate('/')}>
                    <CloseIcon/>
                </IconButton>
            </Stack>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={severity} sx={{width: '100%'}}>
                        {message}
                    </Alert>
                </Snackbar>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" onSubmit={submitHandler} sx={{my: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoFocus
                                    fullWidth
                                    label="First Name"
                                    name="firstName"
                                    id="firstName"
                                    value={firstName}
                                    onChange={(event) => {
                                        setFirstName(event.target.value);
                                        validateFirstName(event.target.value);
                                    }}
                                    error={!!firstNameHelperText}
                                    helperText={firstNameHelperText}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    onChange={(event) => {
                                        setLastName(event.target.value);
                                        validatLastName(event.target.value);
                                    }}
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    value={lastName}
                                    error={!!lastNameHelperText}
                                    helperText={lastNameHelperText}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    onChange={(event) => {
                                        setEmail(event.target.value.toLowerCase());
                                        validateEmail(event.target.value);
                                    }}
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    value={email}
                                    error={!!emailHelperText}
                                    helperText={emailHelperText}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                        validatePassword(event.target.value);
                                    }}
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    value={password}
                                    error={!!passwordHelperText}
                                    helperText={passwordHelperText}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    onChange={(event) => {
                                        setConfirmPassword(event.target.value);
                                        validateConfirmPassword(event.target.value);
                                    }}
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    error={!!confirmPasswordHelperText}
                                    helperText={confirmPasswordHelperText}
                                />
                            </Grid>
                        </Grid>
                        <LoadingButton
                            loading={signInUp}
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Sign Up
                        </LoadingButton>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <RouterLink
                                    to={`/login${searchParams.get('ref') ? `?ref=${searchParams.get('ref')}` : ''}`}
                                    style={{color: theme.palette.primary.main}}
                                >
                                    Already have an account? Sign in
                                </RouterLink>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright/>
            </Container>
        </ThemeProvider>

    );
}

export default SignUp;