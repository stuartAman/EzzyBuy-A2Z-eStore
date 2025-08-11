import client from "./HttpClient";
import authHeader from "./AuthHeader";

class UserService {
    // Addresses
    // Get all Addresses
    getSavedAddresses() {
        return client.get('/user-details/address/display', {headers: authHeader()})
            .then(response => response.data)
    }

    // Add new address
    saveNewAddress(address) {
        return client.post('/user-details/address/add', address, {headers: authHeader()})
            .then(response => response.data);
    }

    // Delete saved address
    deleteAddress(addressId) {
        return client.delete('/user-details/address/delete', {
            headers: authHeader(),
            data: {addressId}
        })
            .then(response => response.data);
    }

    // Change Default Address
    // Shipping
    changeDefaultShipping(addressId) {
        return client.post('/user-details/address/change-shipping', {addressId}, {headers: authHeader()})
            .then(response => response.data);
    }

    // Billing
    changeDefaultBilling(addressId) {
        return client.post('/user-details/address/change-billing', {addressId}, {headers: authHeader()})
            .then(response => response.data);
    }

    // User
    // Profile
    getUserDetails() {
        return client.get('/user-details/display', {headers: authHeader()})
            .then(response => response.data);
    }

    // edit user details
    // TODO ask backend for changes
    updateUserDetails({firstname, lastname}) {
        return client.post('/user-details/edit', {firstname, lastname}, {headers: authHeader()})
            .then(response => response.data);
    }

    // Update user password
    // TODO ask backend for api
    updateUserPassword({oldPassword, newPassword}) {
        return client.post('/user-details/change-password', {oldPassword, newPassword}, {headers: authHeader()})
            .then(response => response.data);
    }
}

export default new UserService();