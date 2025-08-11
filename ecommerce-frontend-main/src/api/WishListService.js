import client from "./HttpClient";
import AuthService from "./AuthService";
import authHeader from "./AuthHeader";

class WishListService {
    // Check if product in wishlist
    productInWishlist(product_id) {
        // get wishlist from storage
        let wishlist = localStorage.getItem('wishlist');

        // check if wishlist available & parse list
        if (wishlist)
            wishlist = new Set(JSON.parse(wishlist));
        else
            return false;

        // check item is in wishlist
        return wishlist.has(product_id)
    }

    // Add to wishlist
    addToWishList(product_id) {
        return client.post('/wish-list/add', {
            token: AuthService.getUserDetails().token,
            productId: product_id,
        }, {
            headers: authHeader()
        })
            .then(response => {
                // get wishlist & add item
                let wishlist = localStorage.getItem('wishlist');

                // Check if wishlist present
                if (!wishlist) {
                    wishlist = new Set();
                } else {
                    wishlist = new Set(JSON.parse(wishlist));
                }

                // add product to wishlist & store in local storage
                wishlist.add(product_id);
                localStorage.setItem('wishlist', JSON.stringify([...wishlist]));

                return response.data.message;
            });
    }

    // remove from wishlist
    removeFromWishList(product_id) {
        return client.delete('/wish-list/remove', {
            headers: authHeader(),
            data: {
                token: AuthService.getUserDetails().token,
                productId: product_id,
            }
        })
            .then(response => {
                // get wishlist & add item
                let wishlist = localStorage.getItem('wishlist');

                // parse wishlist
                wishlist = new Set(JSON.parse(wishlist));

                // remove product from wishlist & update in local storage
                wishlist.delete(product_id);
                localStorage.setItem('wishlist', JSON.stringify([...wishlist]));

                return response.data.message;
            });
    }

    // Get wishlist
    getWishList() {
        return client.get(`/wish-list/display`, {headers: authHeader()})
            .then(response => response.data)
    }

    // For badge
    getWishListLength() {
        // get wishlist
        let wishlist = localStorage.getItem('wishlist');

        // Check if wishlist present
        wishlist = wishlist ? new Set(JSON.parse(wishlist)) : new Set();

        return (wishlist.size);
    }
}

export default new WishListService();