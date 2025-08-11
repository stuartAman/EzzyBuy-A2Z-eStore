import React, {useState} from 'react';
import AddressCard from "../Checkout/AddressCard";
import {Stack} from "@mui/material";
import UserService from "../../api/UserService";
import LoadingButton from "@mui/lab/LoadingButton";

const ProfileAddress = ({address, handlers}) => {
    // States
    const [deleteA, setDeleteA] = useState(false);
    const [defaultA, setDefaultA] = useState(false);


    // Delete address
    function deleteAddress(addressId) {
        setDeleteA(true);
        UserService.deleteAddress(addressId)
            .then(() => {
                handlers.updateUserAddresses();

                // Success alert
                handlers.setSeverity("success");
                handlers.setMessage("Successfully deleted address.")
                handlers.setOpenBar(true)

                setDeleteA(false);
            })
            .catch(error => {
                // Success alert
                handlers.setSeverity("error");
                handlers.setMessage(error.response.data ? error.response.data.message : "Successfully deleted address.")
                handlers.setOpenBar(true)

                setDeleteA(false);
            })
    }

    const setDefaultAddress = (addressId) => {
        setDefaultA(true);

        UserService.changeDefaultShipping(addressId)
            .then(() => {
                UserService.changeDefaultBilling(addressId)
                    .then(() => {
                        handlers.setSeverity("success");
                        handlers.setMessage("Successfully updated default address")
                        handlers.setOpenBar(true)

                        setDefaultA(false);
                    })
                    .catch(() => setDefaultA(false));
            }).catch(() => setDefaultA(false));
    };

    return (
        <>
            <AddressCard address={address}/>
            <Stack direction="row" sx={{justifyContent: 'space-around'}}>
                <LoadingButton
                    loading={deleteA}
                    size="small"
                    variant="text"
                    onClick={() => deleteAddress(address.id)}
                >
                    Delete
                </LoadingButton>
                <LoadingButton
                    loading={defaultA}
                    size="small"
                    variant="text"
                    onClick={() => setDefaultAddress(address.id)}
                >
                    Set Default
                </LoadingButton>
            </Stack>
        </>
    );
};

export default ProfileAddress;
