import AuthService from "./AuthService";

export default function authHeader() {
    // Get user from store
    const user = AuthService.getUserDetails();

    // check if user has a token
    if (user && user.token) {
        return {Authorization: 'Bearer ' + user.token}; // for Spring Boot back-end
    } else {
        return {};
    }
}