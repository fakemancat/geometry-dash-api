const request = require('../../functions/request');
const getPages = require('../../functions/getPages');
const splitRes = require('../../functions/splitResult');
const { error, paramError } = require('../../functions/errors');

module.exports = class Users {
    constructor(options = {}) {
        this.options = options;
    }
    
    async getById(ID) {
        if (!this.options.accountID) {
            error('You need to log in to your account');
        }
        if (!ID) {
            paramError('ID');
        }
        let account = await request(`${this.options.server}/getGJUserInfo20.php`, {
            method: 'POST',
            form: {
                gameVersion: '21',
                binaryVersion: '35',
                gdw: '0',
                accountID: this.options.accountID,
                gjp: this.options.gjp,
                targetAccountID: ID,
                secret: 'Wmfd2893gb7'
            }
        });
        if (account == '-1') {
            return null;
        }

        const result = splitRes(account);

        return {
            top: +result[30],
            nick: result[1],
            userID: +result[2],
            accountID: +result[16],
            stars: +result[3],
            diamonds: +result[46],
            coins: +result[13],
            userCoins: +result[17],
            demons: +result[4],
            creatorPoints: +result[8],
            youtube: result[20] == '' ? null : 'https://youtube.com/channel/' + result[20],
            twitter: result[44] == '' ? null : 'https://twitter.com/' + result[44],
            twitch: result[45] == '' ? null : 'https://www.twitch.tv/' + result[45],
            rights: +result[49],
            rightsString: result[49] == '2' ? 'Elder-moderator' : result[49] == '1' ? 'Moderator' : 'User'
        };
    }
    async getByNick(nick) {
        if (!nick) {
            paramError('nick');
        }
        const searched = await request(`${this.options.server}/getGJUsers20.php`, {
            method: 'POST',
            form: {
                gameVersion: '21',
                binaryVersion: '35',
                gdw: '0',
                str: nick,
                total: '0',
                page: '0',
                secret: 'Wmfd2893gb7'
            }
        });
        if (searched == '-1') {
            return null;
        }

        const accountID = searched.split(':')[21];

        return this.getById(accountID);
    }
    async find(params = {}) {
        if (!params.query) {
            paramError('query');
        }
        if (!params.page) {
            params.page = 0;
        }
        if (isNaN(params.page)) {
            error('Parameter "page" must be a number');
        }

        const searched = await request(`${this.options.server}/getGJUsers20.php`, {
            method: 'POST',
            form: {
                gameVersion: '21',
                binaryVersion: '35',
                gdw: '0',
                str: String(params.query),
                page: Number(params.page),
                total: '0',
                secret: 'Wmfd2893gb7'
            }
        });

        if (searched == '-1') {
            return null;
        }

        const data = searched.split('#');
        const users = data[0].split('|');
        const count = data[1].split(':')[0];

        const result = {
            page: params.page,
            pages: users.length < 10 ? 1 : getPages(count),
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
            });
        }

        return result;
    }
};
