const { error } = require('../functions/errors');

module.exports = class Updates {
    constructor(options = {}, api) {
        this.api = api;
        this.options = options;
    }

    on(type, callback, interval = 1000) {

        if (interval < 1000) {
            error('The interval cannot be less than 1000ms');
            return;
        }

        if (type === 'lastNewRequest') {
            let lastRequestID;

            setInterval(async() => {
                const requests = await this.api.friends.getRequests();
                const user = requests.users[0];

                if (!user) return;
                if (lastRequestID === user.requestID) return;
                if (!user.isNew) return;

                lastRequestID = user.requestID;
                callback(user);
            }, interval);

        }

        if (type === 'lastSentRequest') {
            let lastRequestID;

            setInterval(async() => {
                const requests = await this.api.friends.getSentRequests();
                const user = requests.users[0];

                if (!user) return;
                if (lastRequestID === user.requestID) return;

                lastRequestID = user.requestID;
                callback(user);
            }, interval);

        }

        else {
            error('Wrong event type');
            return;
        }

    }
};
