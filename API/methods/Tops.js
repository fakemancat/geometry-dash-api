const request = require('../../functions/request');
const splitRes = require('../../functions/splitResult');
const { error, paramError } = require('../../functions/errors');

module.exports = class Tops {
    constructor(options = {}) {
        this.options = options;
    }
    
    async get(params = {}) {
        if (!this.options.accountID) {
            error('You need to log in to your account');
        }
        if (!params.type) {
            paramError('type');
        }
        const result = await request(`${this.options.server}/getGJScores20.php`, {
            method: 'POST',
            form: {
                gameVersion: '21',
                binaryVersion: '35',
                gdw: '0',
                accountID: this.options.accountID,
                gjp: this.options.gjp,
                type: params.type,
                count: 100,
                secret: 'Wmfd2893gb7'
            }
        });

        if (result == '-1') {
            error('Top type not specified correctly');
        }

        const users = result.split('|').slice(0, params.count || 100);

        let top = [];

        for (let user of users) {
            if (user.length < 1) {
                continue;
            }

            user = splitRes(user);

            top.push({
                top: +user[6],
                nick: user[1],
                userID: +user[2],
                accountID: +user[16],
            });
        }

        return top;
    }
};
