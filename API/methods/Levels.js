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
    }
    get getDaily() { // AHahhAHHAHah
        return this.getById({ levelID: -1 });
    }
    get getWeekly() {
        return this.getById({ levelID: -2});
    }
};
