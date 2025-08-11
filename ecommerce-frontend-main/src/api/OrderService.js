import client from "./HttpClient";
import authHeader from "./AuthHeader";

class OrderService {
    // Order Creation
    createOrder({products, billingAddressId, shippingAddressId}) {
        const productsList = products.map(product => {
            return {
                productId: product.id,
                quantity: product.quantity
            }
        });

        return client.post('/orders/create',
            {productsList, billingAddressId, shippingAddressId},
            {headers: authHeader()})
            .then(response => response.data)
    }

    // Update status of payment
    updatePaymentDetail({transactionId, razorpayOrderId, paid}) {
        console.log(transactionId);
        console.log(razorpayOrderId);
        console.log(paid);
        return client.post('/orders/transaction-handler',
            {transactionId, razorpayOrderId, paid},
            {headers: authHeader()})
            .then(response => response.data);
    }

    // Get user's orders
    getUserOrders() {
        return client.get('/orders/display', {headers: authHeader()})
            .then(response => response.data);
    }

    //Get order's Invoice
    getOrderInvoice({orderId}) {
        console.log(orderId);
        return client.get(`/orders/invoice/${orderId}`, {headers: authHeader(), responseType: 'blob'})
            .then(response => response.data)
    }
}

export default new OrderService();
