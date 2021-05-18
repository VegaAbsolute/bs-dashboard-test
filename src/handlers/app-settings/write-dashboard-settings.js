const fs = require('fs');
const parseObjectByMask = require('../../utils/parse-object-by-mask.js').parseObjectByMask;
const mergeDeep = require('../../utils/merge-deep.js').mergeDeep;
const dashboardAppSettingsValidator =  require('../../utils/validators/dashboard-app-settings-validator.js').dashboardAppSettingsValidator;
const safelyFileWriterSync = require('../../utils/safely-file-writer').safelyFileWriterSync;


const writeDashboardSettings = (DASHBOARD_ROOT_DIR, data) => (logger) => {
    logger.debug('writeDashboardSettings');
    // fetch required fields by mask
    const mask = {
        loggerLevel: null,
        wireless3GConfigs: {
            isSupported: null
        },
        serverConfigs: {
            isRebootLoraOnSaveConfigs: null
        }
    }

    const preparedData = parseObjectByMask(data, mask, false);
    logger.silly(preparedData);
    // Check data for valid
    const validationResult = dashboardAppSettingsValidator(preparedData, logger);

    if (validationResult.isValid) {
        // get current settings
        const settingsStringJson = fs.readFileSync(DASHBOARD_ROOT_DIR + '/dashboard/settings.json');
        const settings = JSON.parse(settingsStringJson);

        // merge settings
        const result = mergeDeep(settings, preparedData);

        // write result
        const stringResultConfigs = JSON.stringify(result, null, '\t');
        //fs.writeFileSync(DASHBOARD_ROOT_DIR + '/dashboard/settings.json', stringResultConfigs);
        const error = safelyFileWriterSync({ pathToTargetFile: DASHBOARD_ROOT_DIR + '/dashboard/settings.json', dataForSave: stringResultConfigs, logger });
        if (error) {
            return {
                result: 'error',
                message: error
            }
        }
    }

    return validationResult;
}

exports.writeDashboardSettings = writeDashboardSettings;
