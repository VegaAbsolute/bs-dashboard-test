const fs = require('fs');
const logger = require('../../utils/logger.js').logger;
const requestDecrypt = require('./request-decrypt.js').requestDecrypt;

const userAuthentication = ({Session, data, requestOrigin, logger, DASHBOARD_ROOT_DIR}) => {
    const usersJson = fs.readFileSync(DASHBOARD_ROOT_DIR + '/users-config.json', 'utf8');
	const users = JSON.parse(usersJson);

    const userData = requestDecrypt(data);
    if (users.login === userData.login && users.password === userData.password) {
        const token = Session.openSession(requestOrigin);
        logger.info(`authorization = success for [${userData.login}]`);
        return { cmd: 'login_request', result: true, msg: 'success', token };
    } else {
        logger.info('authorization = wrong_login_or_password');
        return { cmd: 'login_request', result: false, msg: 'wrong_login_or_password' };
    }
}

exports.userAuthentication = userAuthentication;
