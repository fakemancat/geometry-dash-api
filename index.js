"use strict";

// Classes
const XOR = require('./classes/XOR');

// Functional
const API = require('./API/index');

// Functions
const { error } = require('./functions/errors');
const request = require('./functions/request');
const xor = new XOR();

class GeometryDash {
    constructor(options = {}) {
        // Server
        let server = (options.server || 'http://www.boomlings.com/database').replace(/(\/)$/, '');
        if (!/^(https?)/.test(server)) {
            server = `http://${server}`;
        }
        options.server = server;

        // Password
        if (!options.password) {
            error('Option "password" is required');
        }

        // Nickname
        if (!options.userName) {
            error('Option "userName" is required');
        }

        // GJP
        options.gjp = xor.encodeGJP(options.password);

        this.options = options;
        this.api = new API(this.options);
    }
    // Logon
    async login() {
        const result = await request(`${this.options.server}/accounts/loginGJAccount.php`, {
            method: 'POST',
            form: {
                userName: this.options.userName,
                password: this.options.password,
                udid: 'S15212605216721190533746828475040751000',
                sID: '76561202036250159',
                secret: 'Wmfv3899gc9'
            }
        });

        if (result == '-1') {
            error('Login failed');
        }

        const user = {
            accountID: +result.split(',')[0],
            userID: +result.split(',')[1]
        };

        this.options.accountID = user.accountID;
        return user;
    }
}

module.exports = GeometryDash;
