import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import {Box, Button, FormControl, FormLabel, Radio, RadioGroup} from '@mui/material';
import {CheckOutContext} from "../../Context/CheckOutContext";
import AddressCard from "./AddressCard";
import UserService from "../../api/UserService";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function AddressForm(props) {
    // Context
    const checkout = useContext(CheckOutContext);

    // states
    // Form field
    const [fullName, setFullName] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [landmark, setLandmark] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pinCode, setPinCode] = useState('');
    const [country, setCountry] = useState("INDIA");
    const [addressType, setAddressType] = useState("HOME");
    const [mobile, setMobile] = useState("");
    const [show, setShow] = useState(false);
    // Addresses
    const [radioValue, setRadioValue] = useState('');
    const [addresses, setAddresses] = useState([])
    const [addressLoaded, setAddressLoaded] = useState(false);
    // ValidationText
    const [fullNameHelperText, setFullNameHelperText] = React.useState('');
    const [address1HelperText, setAddress1HelperText] = React.useState('');
    const [cityHelperText, setCityHelperText] = React.useState('');
    const [stateHelperText, setStateHelperText] = React.useState('');
    const [pinCodeHelperText, setPinCodeHelperText] = React.useState('');
    const [mobileHelperText, setMobileHelperText] = React.useState('');
    const [addingAddress, setAddingAddress] = useState(false);
    const [alertData, setAlertData] = useState({});
    const [alert, setAlert] = useState(false);

    // validations
    function validateFullName(fullName) {
        setFullNameHelperText('');
        if (fullName.length < 1) {
            setFullNameHelperText("This Field Cannot be Empty")
            return false;
        } else if (fullName.landmark > 60) {
            setFullNameHelperText("Full name can not be more than 60 character long")
            return false;
        }
        return true;
    }

    function validateAddress1(address1) {
        setAddress1HelperText('');
        if (address1.length < 1) {
            setAddress1HelperText("This Field Cannot be Empty")
            return false;
        } else if (address1.length > 40) {
            setAddress1HelperText("Line 1 can not be more than 40 character long")
            return false;
        }
        return true;
    }

    function validateCity(city) {
        setCityHelperText('');
        if (city.length < 1) {
            setCityHelperText("This Field Cannot be Empty")
            return false;
        } else if (city.length > 50) {
            setCityHelperText("City name can not be more than 50 character length")
            return false;
        }
        return true;
    }

    function validateState(state) {
        setStateHelperText('');
        if (state.length < 1) {
            setStateHelperText("This field cannot be empty");
            return false;
        } else if (state.length > 50) {
            setStateHelperText("State name can not be more than 50 character length")
            return false;
        }
        return true;
    }

    function validatePincode(pincode) {
        setPinCodeHelperText('');
        if (pincode.length < 3 || pincode.length > 6) {
            setPinCodeHelperText("Not a valid pincode");
            return false;
        }
        return true;
    }

    function validateMobile(mobile) {
        setMobileHelperText('');
        if (!/^([+]?)([\d]+){10,14}$/.test(mobile)) {
            setMobileHelperText("Not a valid mobile number");
            return false;
        }
        return true;
    }

    // address handler
    const handleNewAddress = () => {
        if (validateFullName(fullName) && validateAddress1(address1) && validateCity(city) && validateState(state) && validatePincode(pinCode)) {
            // Animations
            setAddingAddress(true);

            // save new Address
            UserService.saveNewAddress(
                {
                    typeOfAddress: addressType,
                    country: country,
                    state: state,
                    fullName: fullName,
                    pincode: pinCode,
                    mobileNumber: mobile,
                    line1: address1,
                    line2: address2,
                    landmark: landmark,
                    townCity: city
                }
            )
                .then(() => {
                    // Stop Animation
                    setAddingAddress(false);

                    // Scroll to top
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth' // for smoothly scrolling
                    });

                    setShow(false);

                    // Reset Fields
                    setFullName('');
                    setAddress1('');
                    setAddress2('');
                    setLandmark('');
                    setCity('');
                    setPinCode('');
                    setState('');
                    setCountry('');
                        setMobile('');

                        // Show Success
                        setAlertData(data => {
                            data.state = true;
                            data.severity = "success";
                            data.message = "Successfully added address";
                            return data;
                        });
                        setTimeout(() => {
                            setAlertData(data => {
                                data.state = false;
                                return data;
                            });
                        }, 10000);

                        // fetch addresses
                        UserService.getSavedAddresses()
                            .then(async (addrs) => {
                                await setAddresses(addrs);

                                // Enable Button
                                props.setDisabled(false);

                                // Set address when there's only added address
                                if (Object.keys(addresses).length === 1) {
                                    setRadioValue(addrs[Object.keys(addrs)[0]].id);
                                    checkout.address.set(Object.keys(addrs)[0]);
                                    checkout.billing.set(Object.keys(addrs)[0]);
                                }
                            })
                            .catch(error => {
                                // Show Error
                                setAlertData({
                                        severity: "error",
                                        message: error.response.message ? error.response.message : "Error while fetching address",
                                    }
                                );
                                setAlert(true);

                                setTimeout(() => setAlert(false), 10000);
                            })
                    }
                )
                .catch(error => {
                    setAddingAddress(false);

                    // Show Error
                    setAlertData({
                            severity: "error",
                            message: error.response.message ? error.response.message : "Error while saving address",
                        }
                    );
                    setAlert(true);

                    setTimeout(() => setAlert(false), 10000);
                });
        } else {
            // Show Warning
            setAlertData({
                    severity: "warning",
                    message: "Please enter valid details",
                }
            );
            setAlert(true);

            setTimeout(() => setAlert(false), 10000);
        }
    }

    // init
    const init = new BroadcastChannel('init');
    // select default address
    init.onmessage = event => {
        checkout.address.set(addresses[Object.keys(event.data)[0]]);
        checkout.billing.set(addresses[Object.keys(event.data)[0]]);
        setRadioValue(Object.keys(event.data)[0]);
    }

    useEffect(() => {
        UserService.getSavedAddresses()
            .then((address) => {
                    // set addresses
                    setAddresses(address);

                    // Enable Next Button
                    if (Object.keys(address).length > 0)
                        props.setDisabled(false);

                    if (Object.keys(address).length > 0)
                        init.postMessage(address);

                    // address Loaded
                    setAddressLoaded(true);
                }
            )
            .catch(() => {
                // address Loaded
                setAddressLoaded(true);
            });
        // eslint
    }, []);

    return (
        <>
            <Box sx={{mb: 2, p: 2}}>
                <FormControl>
                    <FormLabel id='address-group-label'>
                        Addresses:
                    </FormLabel>
                    {
                        Object.keys(addresses).length > 0 ? (
                            <RadioGroup
                                name='address-group'
                                aria-labelledby='address-group-label'
                                value={radioValue}
                                onChange={(event) => {
                                    setRadioValue(event.target.value);
                                    checkout.address.set(addresses[event.target.value]);
                                    checkout.billing.set(addresses[event.target.value]);
                                }}
                                row
                            >
                                {
                                    Object.keys(addresses).map((addressId, idx) => (
                                        <FormControlLabel
                                            key={idx}
                                            control={<Radio sx={{display: 'none'}}/>}
                                            label={<AddressCard address={addresses[addressId]}
                                                                selectedAddress={radioValue}/>}
                                            value={addressId}
                                        />
                                    ))
                                }
                            </RadioGroup>
                        ) : addressLoaded ? (
                            <Stack
                                direction="row"
                                sx={{
                                    width: "100%",
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    p: 2, m: 1
                                }}
                            >
                                <Typography variant="h5">
                                    No Addresses Available
                                </Typography>

                            </Stack>
                        ) : (
                            <Stack sx={{justifyContent: 'center', alignItems: 'center'}}>
                                <CircularProgress sx={{m: 5}}/>
                            </Stack>
                        )}
                </FormControl>
            </Box>
            <Stack
                direction="row"
                spacing={2}
                sx={{
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                }}
            >
                <Button variant='contained' onClick={() => setShow(!show)}>{show ? "Close" : "Add Address"}</Button>
                <Typography variant="caption">*Selected address will be both billing & shipping address</Typography>
            </Stack>
            {/*Alert*/}
            <Collapse in={alert} sx={{mb: -6}}>
                <Alert
                    severity={alertData.severity}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => setAlert(false)}
                        >
                            <CloseIcon fontSize="inherit"/>
                        </IconButton>
                    }
                    sx={{mt: 2}}
                >
                    {alertData.message ? alertData.message : ""}
                </Alert>
            </Collapse>
            {/*Address Form*/}
            {show && <Box component='form'>
                <Typography variant="h6" sx={{mt: 7}} gutterBottom>
                    Shipping address
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="fullName"
                            name="fullName"
                            label="Full name"
                            fullWidth
                            autoComplete="given-name"
                            variant="standard"
                            onChange={(event) => {
                                setFullName(event.target.value);
                                validateFullName(event.target.value);
                            }}
                            helperText={fullNameHelperText}
                            error={fullNameHelperText}
                            value={fullName}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            required
                            id="address1"
                            name="address1"
                            label="Address line 1"
                            fullWidth
                            autoComplete="shipping address-line1"
                            variant="standard"
                            onChange={(event) => {
                                setAddress1(event.target.value);
                                validateAddress1(event.target.value);
                            }}
                            helperText={address1HelperText}
                            error={address1HelperText}
                            value={address1}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="address2"
                            name="address2"
                            label="Address line 2"
                            fullWidth
                            autoComplete="shipping address-line2"
                            variant="standard"
                            onChange={(event) => {
                                setAddress2(event.target.value);
                            }}
                            value={address2}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="landmark"
                            name="landmark"
                            label="Landmark"
                            fullWidth
                            autoComplete="shipping landmark"
                            variant="standard"
                            onChange={(event) => {
                                setLandmark(event.target.value);
                            }}
                            value={landmark}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="city"
                            name="city"
                            label="City"
                            fullWidth
                            autoComplete="shipping address-level2"
                            variant="standard"
                            onChange={(event) => {
                                setCity(event.target.value);
                                validateCity(event.target.value);
                            }}
                            helperText={cityHelperText}
                            error={!!cityHelperText}
                            value={city}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="state"
                            name="state"
                            label="State"
                            fullWidth
                            variant="standard"
                            onChange={(event) => {
                                setState(event.target.value);
                                validateState(event.target.value);
                            }}
                            helperText={stateHelperText}
                            error={!!stateHelperText}
                            value={state}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="pinCode"
                            name="pinCode"
                            label="Pin code"
                            fullWidth
                            autoComplete="pincode"
                            variant="standard"
                            onChange={(event) => {
                                setPinCode(event.target.value);
                                validatePincode(event.target.value);
                            }}
                            helperText={pinCodeHelperText}
                            error={!!pinCodeHelperText}
                            value={pinCode}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="countryLabel">Country</InputLabel>
                            <Select
                                required
                                labelId="countryLabel"
                                id="country"
                                value={country}
                                label="Country"
                                onChange={event => setCountry(event.target.value)}
                            >
                                <MenuItem value="INDIA">India</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            error={mobileHelperText}
                            required
                            id="mobile"
                            name="mobile"
                            label="Mobile"
                            fullWidth
                            type="tel"
                            autoComplete="mobile no"
                            variant="standard"
                            onChange={(event) => {
                                setMobile(event.target.value);
                                validateMobile(event.target.value);
                            }}
                            helperText={mobileHelperText}
                            value={mobile}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="addressTypeLabel">Address Type</InputLabel>
                            <Select
                                required
                                labelId="addressTypeLabel"
                                id="addressTypeSelect"
                                value={addressType}
                                label="Age"
                                onChange={event => setAddressType(event.target.value)}
                            >
                                <MenuItem value="HOME">Home</MenuItem>
                                <MenuItem value="OFFICE">Office</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}
                          fullWidth>
                        <LoadingButton
                            loading={addingAddress}
                            loadingPosition="start"
                            type="button"
                            variant="contained"
                            sx={{mt: 3, mb: 2, minWidth: 100}}
                            onClick={handleNewAddress}
                        >
                            Add
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Box>}
        </>
    );
}