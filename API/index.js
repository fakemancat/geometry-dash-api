const Tops = require('./methods/Tops');
const Users = require('./methods/Users');
const Levels = require('./methods/Levels');
const Account = require('./methods/Account');
const Friends = require('./methods/Friends');

module.exports = class API {
    constructor(options = {}) {
        this.tops = new Tops(options);
        this.users = new Users(options);
        this.levels = new Levels(options);
        this.account = new Account(options);
        this.friends = new Friends(options);
    }
};
