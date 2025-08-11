import React, {useEffect, useState} from 'react';
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

const AddressCard = ({address, selectedAddress}) => {
    // States
    const [selected, setSelected] = useState(false);

    useEffect(() => {
        setSelected(address.id === parseInt(selectedAddress))
    }, [selectedAddress]);

    return (
        <Card
            display='flex'
            sx={{
                m: 1,
                py: 1,
                px: 1,
                minWidth: 220,
                maxWidth: 250,
                minHeight: 180,
                border: selected ? '1px solid' : '0px',
                borderColor: selected ? 'primary.main' : '',
            }}
        >
            <Typography variant="subtitle1" sx={{textWeight: 'bold', textTransform: 'capitalize'}} gutterBottom>
                <b>{address.fullName}</b>
            </Typography>
            <Typography variant="body2" sx={{textWeight: 'bold', textTransform: 'capitalize'}}>
                {address.line1},
            </Typography>
            {
                address.line2 &&
                <Typography variant="body2" sx={{textWeight: 'bold', textTransform: 'capitalize'}}>
                    {address.line2 + ","}
                </Typography>
            }
            <Typography variant="body2" sx={{textWeight: 'bold', textTransform: 'capitalize'}}>
                {address.landmark ? address.landmark + ", " : ""} {address.townCity},
            </Typography>
            <Typography variant="body2" sx={{textWeight: 'bold', textTransform: 'capitalize'}}>
                {address.state}, {" "} {address.country}
            </Typography>
            <Typography variant="body2" sx={{textWeight: 'bold', textTransform: 'capitalize'}} gutterBottom>
                {address.pincode},
            </Typography>
            <Typography variant="body2" sx={{textWeight: 'bold', textTransform: 'capitalize'}}>
                Mobile: <b>{address.mobileNumber}</b>
            </Typography>
        </Card>
    );
};

export default AddressCard;
