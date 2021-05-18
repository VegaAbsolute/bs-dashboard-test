const uuidv4 = require('uuid/v4');

const tokenLifeTime = 3600000; //3600000 - 1 hour

class Session {
    constructor() {
        this.session = {};
    }

    openSession(headersOrigin) {
        let newToken;
        let i = 1;
        while (true) {
            newToken = uuidv4();
            if (this.session[newToken] === undefined) {
                const lifeTime = new Date().getTime() + tokenLifeTime;
                this.session[newToken] = {referer: headersOrigin, lifeTime};
                break;
            }
            i++;
            if (i > 100) {
                break;
            }
        }

        return newToken;
    }

    closeSession({ loginToken }) {
        delete this.session[loginToken];
        //logger('exists sessions =', this.session);
    }

    removeOldSessions() {
        const currentDate = new Date().getTime();
        let newSessions = {}
        for(var key in this.session) {
            if (this.session[key].lifeTime > currentDate) {
                newSessions[key] = this.session[key];
            }
        }
        this.session = newSessions;
    }

    extendSession(token) {
        const newLifeTime = new Date().getTime() + tokenLifeTime;
        this.session[token].lifeTime = newLifeTime;
    }

    checkToken(token, headersOrigin) {
        //check token life time
        this.removeOldSessions();
        //check to token exists
        let result = true;
        if (this.session[token] === undefined) {
            result = false;
        } else if (this.session[token].referer !== headersOrigin){
            result = false;
        }

        if (result) {
            this.extendSession(token);
        }
        return result;
    }

    isTokenExists(token) {
        //check token life time
        this.removeOldSessions();
        return (this.session[token] !== undefined)
    }
}

exports.Session = Session;
