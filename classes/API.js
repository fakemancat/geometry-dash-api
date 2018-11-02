const { error } = require('../functions/errors');
const splitRes = require('../functions/splitResult');
const getPages = require('../functions/getPages');
const request = require('../functions/request');

const XOR = require('./XOR');
const xor = new XOR();

const Users = function (options) {
    return {
        getById: async function (ID) {
            if (!options.accountID) {
                error('You need to log in to your account');
            }
            if (!ID) {
                error('Parameter "ID" is required');
            }
            let account = await request(`${options.server}/getGJUserInfo20.php`, {
                method: 'POST',
                form: {
                    gameVersion: "21",
                    binaryVersion: "35",
                    gdw: "0",
                    accountID: options.accountID,
                    gjp: options.gjp,
                    targetAccountID: ID,
                    secret: "Wmfd2893gb7"
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
        },
        getByNick: async function (NICK) {
            if (!NICK) {
                error('Parameter "nick" is required');
            }
            const searched = await request(`${options.server}/getGJUsers20.php`, {
                method: 'POST',
                form: {
                    gameVersion: '21',
                    binaryVersion: '35',
                    gdw: '0',
                    str: NICK,
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
        },
        find: async function (params = {}) {
            if (!params.query) {
                error('Parameter "key" is required');
            }
            if (!params.page) {
                params.page = 0;
            }
            if (isNaN(params.page)) {
                error('Parameter "page" must be a number');
            }

            const searched = await request(`${options.server}/getGJUsers20.php`, {
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
};

const Friends = function (options) {
    return {
        addRequest: async function (params = {}) {
            if (!options.accountID) {
                error('You need to log in to your account');
            }
            if (!params.toAccountID) {
                error('Parameter "toAccountID" is required');
            }
            if (!params.message) {
                error('Parameter "message" is required');
            }

            try {
                const result = await request(`${options.server}/uploadFriendRequest20.php`, {
                    method: 'POST',
                    form: {
                        gameVersion: '21',
                        binaryVersion: '35',
                        gdw: '0',
                        accountID: options.accountID,
                        gjp: options.gjp,
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
};

const Levels = function (options) {
    return {
        getById: async function (levelID) {
            if (!levelID) {
                error('Parameter "levelID" is required');
            }
            let level = await request(`${options.server}/downloadGJLevel22.php`, {
                method: 'POST',
                form: {
                    gameVersion: '21',
                    binaryVersion: '35',
                    gdw: '0',
                    levelID: levelID,
                    inc: '0',
                    extras: '0',
                    secret: 'Wmfd2893gb7'
                }
            });
            if (level == '-1') {
                return null;
            }

            const result = splitRes(level);

            const [starAuto, starDemon] = [result[25], result[17]];
            let diff = {
                0: 'NA',
                10: 'Easy',
                20: 'Normal',
                30: 'Hard',
                40: 'Harder',
            }[result[9]] || (starAuto == '1' ? 'Auto' : starDemon == '1' ? 'Demon' : 'Insane');

            const length = [
                'tiny',
                'short',
                'medium',
                'long',
                'XL'
            ][result[15]];

            let password = +xor.cipher((Buffer.from(result[27], 'base64').toString()), 26364);
            password = String(password);

            if (password.length > 1) {
                password = Number(password.join('')) - 1000000;
            }
            else {
                password = Number(password.join(''));
            }

            let answer = {
                levelID: +result[1],
                name: result[2],
                desc: result[3],
                version: +result[5],
                creatorID: +result[6],
                diff,
                downloads: +result[10],
                likes: +result[14],
                track: +result[12],
                gameVersion: +result[13],
                demonDiff: +result[43],
                stars: +result[18],
                isFeatured: +result[19] > 0,
                isEpic: +result[42] == 1,
                length,
                original: +result[30],
                songID: +result[35],
                coins: +result[37],
                requestedStars: +result[39],
                isLDM: +result[40] == 1,
                password
            };

            if (options.levelString) {
                answer['levelString'] = result[4];
            }

            return answer;
        }
    };
};

const Tops = function (options) {
    return {
        get: async function (params = {}) {
            if (!params.type) {
                error('Parameter "type" is required');
            }
            const result = await request(`${options.server}/getGJScores20.php`, {
                method: 'POST',
                form: {
                    gameVersion: '21',
                    binaryVersion: '35',
                    gdw: '0',
                    accountID: options.accountID,
                    gjp: options.gjp,
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
};

module.exports = class API {
    // Options
    constructor(options = {}) {
        this.tops = Tops(options);
        this.users = Users(options);
        this.levels = Levels(options);
        this.friends = Friends(options);
    }
};
