const request = require('../../functions/request');
const { error, paramError } = require('../../functions/errors');

const XOR = require('../../classes/XOR');
const xor = new XOR();

module.exports = class Account {
    constructor(options = {}) {
        this.options = options;
    }
    
    async addPost(text = 'Text is not found') {
        if (!this.options.accountID) {
            error('You need to log in to your account');
        }

        const result = await request(`${this.options.server}/uploadGJAccComment20.php`, {
            method: 'POST',
            form: {
                gameVersion: '21',
                binaryVersion: '35',
                gdw: '0',
                accountID: this.options.accountID,
                gjp: this.options.gjp,
                userName: this.options.userName,
                comment: xor.b64to(text),
                secret: 'Wmfd2893gb7',
                cType: 0
            }
        });

        if (result == '-1') {
            return null;
        }

        return +result;
    }
    async deletePost(commentID) {
        if (!commentID) {
            paramError('commentID');
        }
        const result = await request(`${this.options.server}/deleteGJAccComment20.php`, {
            method: 'POST',
            form: {
                gameVersion: '21',
                binaryVersion: '35',
                gdw: '0',
                accountID: this.options.accountID,
                gjp: this.options.gjp,
                commentID,
                secret: 'Wmfd2893gb7',
                cType: '1'
            }
        });

        if (result == '-1') {
            return null;
        }

        return true;
    }
    async updateSettings(params = {}) {
        if (!params.messagesFrom) {
            params.msgsFrom = 'all';
        }
        if (!params.friendReqsFrom) {
            params.friendReqsFrom = 'all';
        }
        if (!params.commentHistoryTo) {
            params.commentHistoryTo = 'all';
        }
        if (!params.youtube) {
            params.youtube = '';
        }
        if (!params.twitter) {
            params.twitter = '';
        }
        if (!params.twitch) {
            params.twitch = '';
        }

        const mS = {
            'all': 0,
            'friends': 1,
            'none': 2
        }[params.messagesFrom] || 0;

        const frS = {
            'all': 0,
            'none': 1
        }[params.friendReqsFrom] || 0;

        const cS = {
            'all': 0,
            'friends': 1,
            'me': 2
        }[params.commentHistoryTo] || 0;

        const result = await request(`${this.options.server}/updateGJAccSettings20.php`, {
            method: 'POST',
            form: {
                accountID: this.options.accountID,
                gjp: this.options.gjp,
                mS,
                frS,
                cS,
                yt: params.youtube,
                twitter: params.twitter,
                twitch: params.twitch,
                secret: 'Wmfv3899gc9'
            }
        });

        if (result == '-1') {
            return null;
        }

        return true;
    }
};
