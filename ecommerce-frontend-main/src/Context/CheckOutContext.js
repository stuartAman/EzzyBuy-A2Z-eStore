import React, {createContext, useState} from "react";

export const CheckOutContext = createContext(undefined);

const CheckOutProvider = (props) => {
    // states
    const [products, setProducts] = useState([]);
    const [shippingAddress, setShippingAddress] = useState(null);
    const [billingAddress, setBillingAddress] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isCheckedOut, setIsCheckedOut] = useState(false);

    const data = {
        products: {
            get: products,
            set: setProducts
        },
        address: {
            get: shippingAddress,
            set: setShippingAddress
        },
        billing: {
            get: billingAddress,
            set: setBillingAddress
        },
        total: {
            get: totalPrice,
            set: setTotalPrice
        },
        checked: {
            get: isCheckedOut,
            set: setIsCheckedOut
        },
        clear: () => {
            setProducts([]);
            setShippingAddress(null);
            setBillingAddress(null);
            setTotalPrice(0);
        },
        description: products.length < 1 ? [""] : products.map(p => p.name),
    }

    return (
        <CheckOutContext.Provider value={data}>
            {props.children}
        </CheckOutContext.Provider>
    );
};

export default CheckOutProvider;