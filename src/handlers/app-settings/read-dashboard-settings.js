const fs = require('fs');
const parseObjectByMask = require('../../utils/parse-object-by-mask.js').parseObjectByMask;

const readDasboardSettings = (DASHBOARD_ROOT_DIR) => (logger) => {
    logger.silly('readDasboardSettings');
    const stringJson = fs.readFileSync(DASHBOARD_ROOT_DIR + '/dashboard/settings.json');
    const settings = JSON.parse(stringJson);

    const mask = {
        loggerLevel: '',
        wireless3GConfigs: {
            isSupported: 'false'
        },
        serverConfigs: {
            isRebootLoraOnSaveConfigs: false
        }
    }
    const result = parseObjectByMask(settings, mask);
    logger.silly(result);
    return result;
}

exports.readDasboardSettings = readDasboardSettings;
