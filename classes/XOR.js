"use strict";

module.exports = class XOR {
    // Base64 functions
    b64from(text) {
        return Buffer.from(text, 'base64').toString('utf-8');
    }
    b64to(text) {
        return Buffer.from(text).toString('base64');
    }

    // Xor functions
    chr(ascii) {
        return String.fromCodePoint(ascii);
    }
    text2ascii(input) {
        input = String(input);
        const size = input.length;
        let res = [];
        for (let i = 0; i < size; i++) {
            res.push(input[i].charCodeAt());
        }
        return res;
    }
    cipher(data, key) {
        key = this.text2ascii(key);
        data = this.text2ascii(data);
        let keysize = key.length;
        let input_size = data.length;
        let cipher = '';

        for (let i = 0; i < input_size; i++) {
            cipher += this.chr(data[i] ^ key[i % keysize]);
        }
        return cipher;
    }
    encodeGJP(password) {
        let gjpencode = this.cipher(password, 37526);
        gjpencode = Buffer.from(gjpencode).toString('base64');
        gjpencode = gjpencode
            .replace(/\//g, '_')
            .replace(/\+/g, '-');

        return gjpencode;
    }
};
