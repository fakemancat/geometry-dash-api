const { error, paramError } = require('../functions/errors');
const splitRes = require('../functions/splitResult');
const getPages = require('../functions/getPages');
const request = require('../functions/request');

const XOR = require('./XOR');
const xor = new XOR();

const Account = function (options) {
    return {
        addPost: async function (text = 'Text is required') {
            if (!options.accountID) {
                error('You need to log in to your account');
            }

            const result = await request(`${options.server}/uploadGJAccComment20.php`, {
                method: 'POST',
                form: {
                    gameVersion: '21',
                    binaryVersion: '35',
                    gdw: '0',
                    accountID: options.accountID,
                    gjp: options.gjp,
                    userName: options.userName,
                    comment: Buffer.from(text).toString('base64'),
                    secret: 'Wmfd2893gb7',
                    cType: 0
                }
            });

            if (result == '-1') {
                return null;
            }

            return +result;
        },
        deletePost: async function (commentID) {
            if (!commentID) {
                paramError('commentID');
            }
            const result = await request(`${options.server}/deleteGJAccComment20.php`, {
                method: 'POST',
                form: {
                    gameVersion: '21',
                    binaryVersion: '35',
                    gdw: '0',
                    accountID: options.accountID,
                    gjp: options.gjp,
                    commentID,
                    secret: 'Wmfd2893gb7',
                    cType: '1'
                }
            });

            if (result == '-1') {
                return null;
            }

            return true;
        },
        updateSettings: async function (params = {}) {
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

            const result = await request(`${options.server}/updateGJAccSettings20.php`, {
                method: 'POST',
                form: {
                    accountID: options.accountID,
                    gjp: options.gjp,
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
};

const Users = function (options) {
    return {
        getById: async function (ID) {
            if (!options.accountID) {
                error('You need to log in to your account');
            }
            if (!ID) {
                paramError('ID');
            }
            let account = await request(`${options.server}/getGJUserInfo20.php`, {
                method: 'POST',
                form: {
                    gameVersion: '21',
                    binaryVersion: '35',
                    gdw: '0',
                    accountID: options.accountID,
                    gjp: options.gjp,
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
        },
        getByNick: async function (nick) {
            if (!nick) {
                paramError('nick');
            }
            const searched = await request(`${options.server}/getGJUsers20.php`, {
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
        },
        find: async function (params = {}) {
            if (!params.query) {
                paramError('query');
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
                paramError('toAccountID');
            }
            if (!params.message) {
                paramError('message');
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
        getById: async function (params) {
            if (!params.levelID) {
                paramError('levelID');
            }
            if (isNaN(params.levelID)) {
                error('Parameter "levelID" must be a number');
            }

            let level = await request(`${options.server}/downloadGJLevel22.php`, {
                method: 'POST',
                form: {
                    gameVersion: '21',
                    binaryVersion: '35',
                    gdw: '0',
                    levelID: params.levelID,
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
                50: (starAuto == '1' ? 'Auto' : starDemon == '1' ? 'Demon' : 'Insane')
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
                password = Number(password) - 1000000;
            }
            else {
                password = Number(password);
            }

            let answer = {
                levelID: +result[1],
                name: result[2],
                desc: result[3],
                version: +result[5],
                creatorUserID: +result[6],
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

            if (params.levelString) {
                answer['levelString'] = result[4];
            }

            return answer;
        },
        getDaily: function () { // AHahhAHHAHah
            return this.getById(-1);
        },
        getWeekly: function () {
            return this.getById(-2);
        }
    };
};

const Tops = function (options) {
    return {
        get: async function (params = {}) {
            if (!options.accountID) {
                error('You need to log in to your account');
            }
            if (!params.type) {
                paramError('type');
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
        this.account = Account(options);
        this.friends = Friends(options);
    }
};
