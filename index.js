"use strict";

// Classes
const XOR = require('./classes/XOR');
const API = require('./classes/API');

// Functions
const { error } = './functions/error';

const xor = new XOR();

class GeometryDash {
    constructor(options = {}) {
        // Server
        let server = (
                options.server || 'http://www.boomlings.com/database'
            )
            .replace(/(\/)$/, '');

        if (!/^(https?)/.test(server)) {
            server = `http://${server}`;
        }
        options.server = server;
        //

        // Password
        if (!options.password) {
            error('Option "password" is required');
        }
        options.password = options.password;
        //

        // Nickname
        if (!options.userName) {
            error('Option "userName" is required');
        }
        options.userName = options.userName;
        //

        // GJP
        options.gjp = xor.encodeGJP(options.password);
        //

        this.api = new API(options);
    }
}

module.exports = GeometryDash;
