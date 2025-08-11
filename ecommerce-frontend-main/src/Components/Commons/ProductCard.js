import React, {useState} from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import {useNavigate} from "react-router-dom";
import Stack from "@mui/material/Stack";
import client from "../../api/HttpClient";
import Box from "@mui/material/Box";

const ProductCard = (props) => {
    // Navigation
    const navigate = useNavigate();

    // For Card Animation
    const [variant, setVariant] = useState("outlined");

    return (
        <>
            <Card
                sx={{
                    maxWidth: 200,
                    minWidth: 200,
                    maxHeight: 300,
                    minHeight: 300,
                    p: 2
                }}
                onMouseOver={() => setVariant("elevation")}
                onMouseLeave={() => setVariant("outlined")}
                onClick={() => navigate(`/product/${props.product.id}`)}
                variant={variant}
                elevation={variant === "elevation" ? 7 : undefined}
            >
                <Stack
                    component="div"
                    sx={{
                        height: 200,
                        width: 160,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Box
                        component="img"
                        src={`${client.defaults.baseURL}/products/image/${props.product.id}`}
                        alt={`${props.product.name}`}
                        sx={{
                            objectFit: "scale-down",
                            height: 180,
                            width: 160
                        }}
                    />
                </Stack>
                <CardContent
                    sx={{
                        p: 0,
                        width: 170,
                        height: 40,
                        "display": "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        "overflow": "clip",
                        textOverflow: "ellipsis",
                    }}
                >
                    <Typography variant="body2" color="text.primary">
                        {props.product.name}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Stack sx={{flexGrow: 1}} alignItems="center">
                        <Typography variant="body2" color="text.primary" sx={{fontWeight: 'bold'}}>
                            {
                                props.product.price.toLocaleString('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                })
                            }
                        </Typography>
                    </Stack>
                </CardActions>
            </Card>
        </>
    );
};

export default ProductCard;
