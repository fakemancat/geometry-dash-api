/* request from FMC */

const request = require('request-promise');

module.exports = async(url = "", params = {}) => {
    if (typeof url === "object") {
        params = url;
    }
    else {
        params.uri = url;
    }

    let res;

    if (params.method == "POST") {
        res = await request(params);
    }
    else if (params.method == "GET" || !params.method) {
        delete params.method;
        res = await request(params);
    }

    return res;
};
