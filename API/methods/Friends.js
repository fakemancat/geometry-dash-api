const request = require('../../functions/request');
const { error, paramError } = require('../../functions/errors');

const XOR = require('../../classes/XOR');
const xor = new XOR();

module.exports = class Friends {
    constructor(options = {}) {
        this.options = options;
    }
    
    async addRequest(params = {}) {
        if (!this.options.accountID) {
            error('You need to log in to your account');
        }
        if (!params.toAccountID) {
            paramError('toAccountID');
        }
        if (!params.message) {
            paramError('message');
        }

        try {
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

            if (result == '-1') {
                return error('Friend request is already sent or parameters are invalid');
            }
        }
        catch (_err) {
            return error('Friend request is already sent or parameters are invalid');
        }

        return true;
    }
};
