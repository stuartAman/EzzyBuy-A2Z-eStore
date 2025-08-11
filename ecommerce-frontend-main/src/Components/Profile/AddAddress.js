import React, {useContext, useState} from 'react';
import Grid from "@mui/material/Grid";
import {Button, FormControl, Stack, TextField} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import LoadingButton from "@mui/lab/LoadingButton";
import UserService from "../../api/UserService";
import {UserContext} from "../../Context/UserContext";

const AddAddress = ({close, update}) => {
    // Context
    const user = useContext(UserContext);

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
    // ValidationText
    const [fullNameHelperText, setFullNameHelperText] = React.useState('');
    const [address1HelperText, setAddress1HelperText] = React.useState('');
    const [cityHelperText, setCityHelperText] = React.useState('');
    const [stateHelperText, setStateHelperText] = React.useState('');
    const [pinCodeHelperText, setPinCodeHelperText] = React.useState('');
    const [mobileHelperText, setMobileHelperText] = React.useState('');
    const [addingAddress, setAddingAddress] = useState(false);

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

                        // Reset Fields
                        setFullName('');
                        setAddress1('');
                        setAddress2('');
                        setLandmark('');
                        setCity('');
                        setPinCode('');
                        setState('');
                        setMobile('');

                        // Show Success
                        user.bar.setSeverity("success");
                        user.bar.setMessage("Successfully added address");
                        user.bar.setOpen(true);

                        close();
                        update();
                    }
                )
                .catch(error => {
                    setAddingAddress(false);

                    user.bar.setSeverity("error");
                    user.bar.setMessage(error.response ? error.response.message : "Error while saving address");
                    user.bar.setOpen(true);
                });
        } else {
            // Show Warning
            user.bar.setSeverity("warning");
            user.bar.setMessage("Please enter valid details");
            user.bar.setOpen(true);
        }
    }

    return (
        <>
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
                <Grid item xs={12}>
                    <Stack
                        direction="row"
                        sx={{
                            flexGrow: 1,
                            justifyContent: 'space-evenly',
                            alignItems: 'center'
                        }}
                    >
                        <LoadingButton
                            loading={addingAddress}
                            loadingPosition="start"
                            type="button"
                            variant="contained"
                            sx={{minWidth: 100}}
                            onClick={handleNewAddress}
                        >
                            Add
                        </LoadingButton>
                        <Button
                            variant={"outlined"}
                            onClick={close}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
};

export default AddAddress;
