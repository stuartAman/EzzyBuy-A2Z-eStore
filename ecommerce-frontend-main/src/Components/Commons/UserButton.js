import {Button, Menu, MenuItem, Typography} from "@mui/material";
import {KeyboardArrowDown} from "@mui/icons-material";
import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import AuthService from "../../api/AuthService";
import {UserContext} from "../../Context/UserContext";

const UserButton = () => {
    // Hooks
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    // State
    const user = useContext(UserContext);

    // Handler Function
    const handleMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {
                user.details.get &&
                <>
                    <Button
                        size="medium"
                        aria-label="user options menu"
                        aria-controls="menu-user"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                        endIcon={<KeyboardArrowDown/>}
                    >
                        <Typography
                            variant={'subtitle1'}
                            sx={{
                                textTransform: 'capitalize',
                                marginLeft: 1
                            }}
                        >
                            {user.details.get.firstname}
                        </Typography>
                    </Button>
                    <Menu
                        id="menu-user"
                        keepMounted
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => {
                            handleClose();
                            navigate('/orders');
                        }}>My Orders</MenuItem>

                        <MenuItem onClick={() => {
                            handleClose();
                            user.refresh();
                            navigate('/profile')
                        }}>My Profile</MenuItem>

                        <MenuItem onClick={() => {
                            AuthService.logout();
                            handleClose();
                            user.details.set(null);
                            navigate('/');
                            user.refresh();
                        }}>
                            Logout
                        </MenuItem>
                    </Menu>
                </>
            }
            {
                !user.details.get &&
                <Button
                    size="medium"
                    color="inherit"
                    onClick={() => {
                        user.refresh();
                        navigate('/login');
                    }}
                    sx={{
                        backgroundColor: theme => theme.palette.primary.contrastText,
                        color: theme => theme.palette.primary.main,
                        ':hover': theme => {
                            return {
                                color: theme.palette.primary.contrastText
                            }
                        }
                    }}
                >
                    <Typography
                        variant={'subtitle1'}
                        sx={{ textTransform: 'capitalize' }}
                    >
                        Login
                    </Typography>
                </Button>
            }
        </>
    );
}

export default UserButton;
