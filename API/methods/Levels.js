const request = require('../../functions/request');
const splitRes = require('../../functions/splitResult');
const { error, paramError } = require('../../functions/errors');

const XOR = require('../../classes/XOR');
const xor = new XOR();

module.exports = class Levels {
    constructor(options = {}) {
        this.options = options;
    }

    async getById(params) {
        if (!params.levelID) {
            paramError('levelID');
        }
        if (isNaN(params.levelID)) {
            error('Parameter "levelID" must be a number');
        }

        let level = await request(`${this.options.server}/downloadGJLevel22.php`, {
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

        const starAuto = result[25];
        const starDemon = result[17];

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

        let password = +xor.decrypt(result[27], 26364);
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
    }
    getDaily() { // AHahhAHHAHah
        return this.getById({ levelID: -1 });
    }
    getWeekly() {
        return this.getById({ levelID: -2 });
    }

    async find(params = {}) {
        // Params OMG.. And that's not all...
        if (!params.len) params.len = '-';
        if (!params.star) params.star = 0;
        if (!params.page) params.page = 0;
        if (!params.type) params.type = 0;
        if (!params.epic) params.epic = 0;
        if (!params.coins) params.coins = 0;
        if (!params.query) paramError('query');
        if (!params.feature) params.feature = 0;
        if (!params.original) params.original = 0;
        if (!params.twoPlayer) params.twoPlayer = 0;
        if (!params.difficulty) params.difficulty = '-';

        const len = {
            'all': '-',
            'tiny': 0,
            'short': 1,
            'medium': 2,
            'long': 3,
            'XL': 4
        }[params.len] || '-';

        const diff = {
            'all': '-',
            'NA': -1,
            'easy': 1,
            'normal': 2,
            'hard': 3,
            'harder': 4,
            'insane': 5,
            'demon': -2,
            'auto': -3
        }[params.difficulty] || '-';

        const searched = await request(`${this.options.server}/getGJLevels21.php`, {
            method: 'POST',
            form: {
                gameVersion: '21',
                binaryVersion: '35',
                gdw: '0',
                len,
                star: params.star,
                page: params.page,
                type: params.type,
                epic: params.epic,
                coins: params.coins,
                str: params.query,
                feature: params.feature,
                original: params.original,
                twoPlayer: params.twoPlayer,
                diff,
                secret: 'Wmfd2893gb7'
            }
        });

        if (searched == '-1') {
            return null;
        }

        const data = searched.split('#');
        const count = +data[3].split(':')[0];
        const levels = data[0].split('|');

        const result = {
            page: params.page,
            pages: levels.length < 10 ? 1 : Math.ceil(count / 10),
            count,
            levels: []
        };

        for (let level of levels) {
            if (level.length < 1) {
                continue;
            }

            level = splitRes(level);

            result.levels.push({
                levelID: +level[1],
                name: level[2],
                creatorUserID: +level[6],
                likes: +level[14],
                downloads: +level[10]
            });
        }

        return result;
    }
};
