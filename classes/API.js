const { error } = require('../functions/errors');
const splitRes = require('../functions/splitResult');
const request = require('../functions/request');

const XOR = require('./XOR');
const xor = new XOR();

const Users = function (options) {
    return {
        options,
        getById: async function (ID) {
            if (!this.options.accountID) {
                error('You need to log in to your account');
            }
            let account = await request(`${this.options.server}/getGJUserInfo20.php`, {
                method: 'POST',
                form: {
                    gameVersion: "21",
                    binaryVersion: "35",
                    gdw: "0",
                    accountID: this.options.accountID,
                    gjp: this.options.gjp,
                    targetAccountID: ID,
                    secret: "Wmfd2893gb7"
                }
            });
            if (account == '-1') {
                error('User is not found');
            }

            const result = splitRes(account);

            return {
                nick: result[1],
                userID: +result[2],
                stars: +result[3],
                demons: +result[4],
                creatorPoints: +result[8],
                coins: +result[13],
                accountID: +result[16],
                userCoins: +result[17],
                youtube: result[20] == '' ? null : 'https://youtube.com/channel/' + result[20],
                twitter: result[44] == '' ? null : 'https://twitter.com/' + result[44],
                twitch: result[45] == '' ? null : 'https://www.twitch.tv/' + result[45],
                globalRang: +result[30],
                diamonds: +result[46],
                rights: +result[49],
                rightsString: result[49] == '2' ? 'Elder-moderator' : result[49] == '1' ? 'Moderator' : 'User'
            };
        },
        getUserByNick: async function (NICK) {
            const searched = await request(`${this.options.server}/getGJUsers20.php`, {
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
                error('User is not found');
            }

            const accountID = searched.split(':')[21];

            return this.getUserById(
                accountID
            );
        }
    };
};

const Friends = function (options) {
    return {
        options,
        addRequest: async function (params = {}) {
            if (!this.options.accountID) {
                error('You need to log in to your account');
            }
            if (!params.toAccountID) {
                error('Parameter toAccountID is required');
            }
            if (!params.message) {
                error('Parameter message is required');
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
                    return error('Error -1');
                }
            }
            catch (a) {
                return error('Error -1');
            }

            return true;
        }
    };
};

const Levels = function (options) {
    return {
        options,
        getById: async function (levelID) {
            let level = await request(`${this.options.server}/downloadGJLevel22.php`, {
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
                error('Level is not found');
            }

            const result = splitRes(level);

            const [starAuto, starDemon] = [result[25], result[17]];
            let diff = {
                0: 'NA',
                10: 'Easy',
                20: 'Normal',
                30: 'Hard',
                40: 'Harder',
                50: starAuto == '1' ? 'Auto' : starDemon == '1' ? 'Demon' : 'Insane'
            }[result[9]];

            diff = starAuto == '1' ? 'Auto' : starDemon == '1' ? 'Demon' : 'Insane';

            const length = [
                'tiny',
                'short',
                'medium',
                'long',
                'XL'
            ][result[15]];

            let password = +xor.cipher((Buffer.from(result[27], 'base64').toString()), 26364);
            password = String(password).split('');

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
                isFeatured: +result[19] > 0 ? true : false,
                isEpic: +result[42] == 1 ? true : false,
                length,
                original: +result[30],
                songID: +result[35],
                coins: +result[37],
                requestedStars: +result[39],
                isLDM: +result[40] == 1 ? true : false,
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
        options,
        get: async function (type) {
            const result = await request(`${this.options.server}/getGJScores20.php`, {
                method: 'POST',
                form: {
                    gameVersion: "21",
                    binaryVersion: "35",
                    gdw: "0",
                    accountID: this.options.accountID,
                    gjp: this.options.gjp,
                    type,
                    count: "100",
                    secret: "Wmfd2893gb7"
                }
            });

            if (result == '-1') {
                error('Top type not specified correctly');
            }

            const users = result.split('|');

            let top = [];

            for (let user of users) {
                user = splitRes(user);

                top.push({
                    rang: +user[6],
                    nick: user[1],
                    userID: user[2],
                    accountID: user[16],
                });
            }

            return top;
        }
    };
};

module.exports = class API {
    // Options
    constructor(options = {}) {
        this.options = options;

        this.tops = Tops(this.options);
        this.users = Users(this.options);
        this.levels = Levels(this.options);
        this.friends = Friends(this.options);
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
};
