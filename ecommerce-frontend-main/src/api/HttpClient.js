const axios = require('axios');

const client = axios.create({
    baseURL: 'http://localhost:8443/api', // localhost
    timeout: 10000
})
export default client;
