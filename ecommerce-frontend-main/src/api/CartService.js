import client from "./HttpClient";
import authHeader from "./AuthHeader";
import AuthService from "./AuthService";

class CartService {
    // Add to cart
    addToCart(product) {
        if (AuthService.getUserDetails()) {
            return client.post('/shopping-cart/add', {
                quantity: product.quantity,
                productId: product.id,
            }, {
                headers: authHeader()
            })
                .then(response => {
                    // get cart & add item
                    let cart = localStorage.getItem('cart');

                    // Check if cart present
                    cart = cart ? JSON.parse(cart) : [];

                    // add product
                    let changed = false;

                    cart = cart.map(p => {
                        if (p.id === product.id) {
                            p.quantity++;
                            changed = true;
                        }
                        return p;
                    });

                    if (!changed)
                        cart = [...cart, {
                            id: product.id,
                            name: product.name,
                            image: product.image,
                            price: product.price,
                            quantity: product.quantity
                        }];

                    localStorage.setItem('cart', JSON.stringify([...cart]));

                    return response.data;
                });
        }
        // Local cart
        return new Promise((resolve) => {
            // get cart & add item
            let cart = localStorage.getItem('tcart');

            // Check if cart present
            cart = cart ? JSON.parse(cart) : [];

            // add product
            let changed = false;

            cart = cart.map(p => {
                if (p.id === product.id) {
                    p.quantity++;
                    changed = true;
                }
                return p;
            });

            if (!changed)
                cart = [...cart, {
                    id: product.id,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    quantity: product.quantity
                }];

            localStorage.setItem('tcart', JSON.stringify([...cart]));

            // return cart
            resolve("Successfully added product to cart.");
        });
    }

// remove from cart
    removeFromCart(product) {
        if (AuthService.getUserDetails()) {
            return client.delete('/shopping-cart/remove', {
                data: {
                    quantity: product.quantity,
                    productId: product.id,
                },
                headers: authHeader()
            })
                .then((response) => {
                    // get cart & add item
                    let cart = localStorage.getItem('cart');

                    // Check if cart present
                    cart = cart ? JSON.parse(cart) : null;
                    if (!cart) throw new Error("Cart is empty.")

                    // add product
                    let changed = false;

                    cart = cart.filter(p => {
                        // found product
                        if (p.id === product.id) {
                            changed = true;
                            return p.quantity > 1 ? p.quantity-- && true : false;
                        }
                        return true;
                    });

                    if (!changed)
                        throw new Error("Product not in the cart")

                    // store cart
                    localStorage.setItem('cart', JSON.stringify([...cart]));

                    return response.data.message;
                });
        }

        // Local Cart
        return new Promise((resolve, reject) => {
            // get cart & add item
            let cart = localStorage.getItem('tcart');

            // Check if cart present
            cart = cart ? JSON.parse(cart) : null;
            if (!cart) reject();

            // add product
            let changed = false;

            cart = cart.filter(p => {
                // found product
                if (p.id === product.id) {
                    changed = true;
                    return p.quantity > 1 ? p.quantity-- && true : false;
                }
                return true;
            });

            if (!changed)
                reject();

            // store cart
            localStorage.setItem('tcart', JSON.stringify([...cart]));

            return resolve(cart);
        });
    }

    // fetch cart from backend
    getShoppingCart() {
        if (AuthService.getUserDetails()) {
            return client.get('/shopping-cart/display', {headers: authHeader()})
                .then(response => response.data);
        }

        // Local Cart
        return new Promise(resolve => {
            // get cart & add item
            let cart = localStorage.getItem('tcart');

            // Check if cart present
            cart = cart ? JSON.parse(cart) : [];

            resolve(cart);
        });
    }

// Get count of items in cart
    getCartLength() {
        // get cart
        let cart = localStorage.getItem('cart');
        let tcart = localStorage.getItem('tcart');

        // Check if cart present
        return cart ? JSON.parse(cart).length : tcart ? JSON.parse(tcart).length : 0;
    }

    // Remove a single product form cart
    removeProductFromCart(productId) {

        if (AuthService.getUserDetails()) {
            return client.delete('/shopping-cart/remove-product', {
                headers: authHeader(),
                data: {productId, quantity: 0}
            })
                .then(response => {
                    // get cart & add item
                    let cart = localStorage.getItem('cart');

                    // Check if cart present
                    cart = cart ? JSON.parse(cart) : null;
                    if (!cart) throw new Error("Cart is empty.")

                    // add product
                    let changed = false;

                    cart = cart.filter(p => {
                        if (p.id === productId) {
                            changed = true;
                            return false;
                        }
                        return true
                    });

                    if (!changed)
                        throw new Error("Product not in the cart")

                    // store cart
                    localStorage.setItem('cart', JSON.stringify([...cart]));

                    return response.data.message;
                });
        }

        return new Promise((resolve, reject) => {
            // get cart & add item
            let cart = localStorage.getItem('tcart');
            // Check if cart present
            cart = cart ? JSON.parse(cart) : null;
            if (!cart) reject();

            // add product
            let changed = false;

            cart = cart.filter(p => {
                if (p.id === productId) {
                    changed = true;
                    return false;
                }
                return true
            });

            if (!changed)
                reject();

            // store cart
            localStorage.setItem('cart', JSON.stringify([...cart]));

            resolve();
        });
    }

// Remove All products from cart
    emptyCart() {
        if (AuthService.getUserDetails()) {
            return client.delete('/shopping-cart/remove-all',
                {headers: authHeader()})
                .then(response => response.data);
        }

        return new Promise(resolve => {
            localStorage.removeItem('tcart', null);
            resolve();
        });
    }
}

export default new CartService();