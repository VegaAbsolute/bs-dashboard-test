const fs = require('fs');
const parseObjectByMask = require('../../utils/parse-object-by-mask.js').parseObjectByMask;
const mergeDeep = require('../../utils/merge-deep.js').mergeDeep;
const appManagerSettingsValidator =  require('../../utils/validators/manager-app-settings-validator.js').appManagerSettingsValidator;
const safelyFileWriterSync = require('../../utils/safely-file-writer').safelyFileWriterSync;


const writeManagerSettings = (DASHBOARD_ROOT_DIR, data) => (logger) => {
    logger.silly('writeManagerSettings');
    // fetch required fields by mask
    const mask = {
        loggerLevel: null,
        SERVER_STARTUP_METHOD: null,
        UPDATE: {
            TIME_INTERVAL_IN_MINUTES: null
        },
        BS_DASHBOARD:
        {
            GIT_NAME: null,
            GIT_REPO: null,
            GIT_PROVIDER: null,
            GIT_DOMAIN: null
        },
        BS_DASHBOARD_MANAGER:
        {
            GIT_NAME: null,
            GIT_REPO: null,
            GIT_PROVIDER: null,
            GIT_DOMAIN: null
        }
    }
    const preparedData = parseObjectByMask(data, mask, false);
    logger.silly(preparedData);

    // Check data for valid
    const validationResult = appManagerSettingsValidator(preparedData, logger);

    if (validationResult.isValid) {
        // get current settings
        const settingsStringJson = fs.readFileSync(DASHBOARD_ROOT_DIR + '/manager/settings.json');
        const settings = JSON.parse(settingsStringJson);

        // merge settings
        const result = mergeDeep(settings, preparedData);

        // write result
        const stringResultConfigs = JSON.stringify(result, null, '\t');
        //fs.writeFileSync(DASHBOARD_ROOT_DIR + '/manager/settings.json', stringResultConfigs);
        const error = safelyFileWriterSync({ pathToTargetFile: DASHBOARD_ROOT_DIR + '/manager/settings.json', dataForSave: stringResultConfigs, logger });
        if (error) {
            return {
                result: 'error',
                message: error
            }
        }
    }

    return validationResult;
}

exports.writeManagerSettings = writeManagerSettings;
