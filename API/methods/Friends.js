const request = require('../../functions/request');
const splitRes = require('../../functions/splitResult');
const { error, paramError } = require('../../functions/errors');

const XOR = require('../../classes/XOR');
const xor = new XOR();

module.exports = class Friends {
    constructor(options = {}) {
        this.options = options;
    }

    async sendRequest(params = {}) {
        if (!this.options.accountID) {
            error('You need to log in to your account');
        }
        if (!params.toAccountID) {
            paramError('toAccountID');
        }
        if (!params.message) {
            paramError('message');
        }

        const result = await request(`${this.options.server}/uploadFriendRequest20.php`, {
            method: 'POST',
            form: {
                gameVersion: '21',
                binaryVersion: '35',
                gdw: '0',
                accountID: this.options.accountID,
                gjp: this.options.gjp,
                toAccountID: params.toAccountID,
                comment: xor.b64to(params.message),
                secret: 'Wmfd2893gb7'
            }
        });

        if (result === '-1') {
            return null;
        }

        return true;
    }
    async deleteRequest(targetAccountID) {
        if (!this.options.accountID) {
            error('You need to log in to your account');
        }
        if (!targetAccountID) {
            paramError('targetAccountID');
        }

        const result = await request(`${this.options.server}/deleteGJFriendRequests20.php`, {
            method: 'POST',
            form: {
                gameVersion: '21',
                binaryVersion: '35',
                gdw: '0',
                accountID: this.options.accountID,
                gjp: this.options.gjp,
                targetAccountID,
                isSender: '0',
                secret: 'Wmfd2893gb7'
            }
        });

        if (result == '-1') {
            return null;
        }

        return true;
    }
    async deleteSentRequest(targetAccountID) {
        if (!this.options.accountID) {
            error('You need to log in to your account');
        }
        if (!targetAccountID) {
            paramError('targetAccountID');
        }

        const result = await request(`${this.options.server}/deleteGJFriendRequests20.php`, {
            method: 'POST',
            form: {
                gameVersion: '21',
                binaryVersion: '35',
                gdw: '0',
                accountID: this.options.accountID,
                gjp: this.options.gjp,
                targetAccountID,
                isSender: '1',
                secret: 'Wmfd2893gb7'
            }
        });

        console.log(result);

        if (result == '-1') {
            return null;
        }

        return true;
    }
    async getRequests(page = 0) {
        if (!this.options.accountID) {
            error('You need to log in to your account');
        }
        const got = await request(`${this.options.server}/getGJFriendRequests20.php`, {
            method: 'POST',
            form: {
                gameVersion: '21',
                binaryVersion: '35',
                gdw: '0',
                accountID: this.options.accountID,
                gjp: this.options.gjp,
                page,
                total: '0',
                secret: 'Wmfd2893gb7'
            }
        });

        if (got == '-1' || got == '-2') {
            return null;
        }

        const data = got.split('#');
        const users = data[0].split('|');
        const count = +data[1].split(':')[0];

        const result = {
            page,
            pages: users.length < 20 ? 1 : Math.ceil(count / 20),
            count,
            users: []
        };

        for (let user of users) {
            if (user.length < 1) {
                continue;
            }

            user = splitRes(user);

            result.users.push({
                nick: user[1],
                userID: +user[2],
                accountID: +user[16],
                date: `${user[37]} ago`,
                isNew: Boolean(user[41]),
                requestID: +user[32],
                message: xor.b64from(user[35]) || 'No Message'
            });
        }

        return result;
    }
    async getSentRequests(page = 0) {
        if (!this.options.accountID) {
            error('You need to log in to your account');
        }
        const got = await request(`${this.options.server}/getGJFriendRequests20.php`, {
            method: 'POST',
            form: {
                gameVersion: '21',
                binaryVersion: '35',
                gdw: '0',
                accountID: this.options.accountID,
                gjp: this.options.gjp,
                page,
                total: '0',
                secret: 'Wmfd2893gb7',
                getSent: '1'
            }
        });

        if (got == '-1' || got == '-2') {
            return null;
        }

        const data = got.split('#');
        const users = data[0].split('|');
        const count = +data[1].split(':')[0];

        const result = {
            page,
            pages: users.length < 20 ? 1 : Math.ceil(count / 20),
            count,
            users: []
        };

        for (let user of users) {
            if (user.length < 1) {
                continue;
            }

            user = splitRes(user);

            result.users.push({
                nick: user[1],
                userID: +user[2],
                accountID: +user[16],
                date: `${user[37]} ago`,
                requestID: +user[32]
            });
        }

        return result;
    }
    async acceptRequest(params = {}) {
        if (!this.options.accountID) {
            error('You need to log in to your account');
        }
        if (!params.targetAccountID) {
            paramError('targetAccountID');
        }
        if (!params.requestID) {
            paramError('requestID');
        }

        const result = await request(`${this.options.server}/acceptGJFriendRequest20.php`, {
            method: 'POST',
            form: {
                gameVersion: '21',
                binaryVersion: '35',
                gdw: '0',
                accountID: this.options.accountID,
                gjp: this.options.gjp,
                targetAccountID: params.accountID,
                requestID: params.requestID,
                secret: 'Wmfd2893gb7'
            }
        });

        if (result == '-1' || result == '-2') {
            return null;
        }

        return true;
    }
};
