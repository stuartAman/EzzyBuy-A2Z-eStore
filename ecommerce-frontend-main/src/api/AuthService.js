import client from './HttpClient';
import WishListService from "./WishListService";
import CartService from "./CartService";
import authHeader from "./AuthHeader";


class AuthService {

    login({email, password}) {
        return client.post("/auth/signin", {email, password})
            .then(response => {
                // Valid Login
                if (response.data.token) {
                    // Save user
                    localStorage.setItem('user', JSON.stringify(response.data));

                    // Check local cart
                    let tcart = localStorage.getItem('tcart');
                    tcart = tcart ? JSON.parse(tcart) : null;

                    // Add to user's cart
                    if (tcart) {
                        tcart.forEach(item => {
                            CartService.addToCart(item);
                        });

                        // remove local cart
                        localStorage.removeItem('tcart');
                    }

                    // fetch wishlist
                    setTimeout(() => {
                        WishListService.getWishList().then(wishlist => {
                            localStorage.setItem('wishlist', JSON.stringify(wishlist.map(item => item.id)));
                        })
                    }, 5000)

                    // fetch cart
                    setTimeout(() => {
                        CartService.getShoppingCart().then(cart => {
                            localStorage.setItem('cart', JSON.stringify([...cart]));
                        });
                    }, 5000)
                }
                return response.data
            });
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('wishlist');
        localStorage.removeItem('cart');

    }

    register(userDetails) {
        return client.post("/auth/signup", userDetails);
    }

    getUserDetails() {
        return JSON.parse(localStorage.getItem('user'))
    }

    isSessionAvailable() {
        return client.get('/test/user', {headers: authHeader()})
    }
}

export default new AuthService();