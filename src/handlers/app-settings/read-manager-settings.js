const fs = require('fs');
const parseObjectByMask = require('../../utils/parse-object-by-mask.js').parseObjectByMask;

const readManagerSettings = (DASHBOARD_ROOT_DIR) => (logger) => {
    logger.silly('readManagerSettings');
    const stringJson = fs.readFileSync(DASHBOARD_ROOT_DIR + '/manager/settings.json');
    const settings = JSON.parse(stringJson);

    const mask = {
        loggerLevel: '',
        SERVER_STARTUP_METHOD: '',
        UPDATE: {
            TIME_INTERVAL_IN_MINUTES: 0
        },
        BS_DASHBOARD:
        {
            GIT_NAME: '',
            GIT_REPO: '',
            GIT_PROVIDER: '',
            GIT_DOMAIN: ''
        },
        BS_DASHBOARD_MANAGER:
        {
            GIT_NAME: '',
            GIT_REPO: '',
            GIT_PROVIDER: '',
            GIT_DOMAIN: ''
        }
    }
    const result = parseObjectByMask(settings, mask);
    logger.silly(result);
    return result;
}

exports.readManagerSettings = readManagerSettings;
