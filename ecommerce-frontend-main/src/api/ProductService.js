import client from './HttpClient';

class ProductService {
    // Get new products
    getRecentlyAddedProducts() {
        return client.get("/products/latest", {mode: 'no-cors'})
            .then(response => response.data);
    }

    // get popular products
    getMostViewedProducts() {
        return client.get("/products/most-visited", {mode: 'no-cors'})
            .then(response => response.data);
    }

    // get product by id
    getProductDetails(product_id) {
        return client.get(`/products/${product_id}`)
            .then(response => response.data);
    }
}

export default new ProductService();