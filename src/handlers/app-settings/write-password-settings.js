const fs = require('fs');
const parseObjectByMask = require('../../utils/parse-object-by-mask.js').parseObjectByMask;
const mergeDeep = require('../../utils/merge-deep.js').mergeDeep;
const appPasswordSettingsValidator = require('../../utils/validators/password-app-settings-validator.js').appPasswordSettingsValidator;
const safelyFileWriterSync = require('../../utils/safely-file-writer').safelyFileWriterSync;

/**
 *
 * @return {object} {result: BOOL, message: STRING}
 */
const writePasswordSettings = (DASHBOARD_ROOT_DIR, data) => (logger) => {
    logger.silly('writePasswordSettings');
    // fetch required fields by mask
    const mask = {
        currentPassword: null,
        newPassword: null
    }
    const preparedData = parseObjectByMask(data, mask);

    // Check data for valid
    const validationResult = appPasswordSettingsValidator(preparedData.newPassword, logger);

    if (validationResult.result) {
        // get current settings
        const settingsStringJson = fs.readFileSync(DASHBOARD_ROOT_DIR + '/users-config.json');
        const settings = JSON.parse(settingsStringJson);
        if (settings.password === preparedData.currentPassword) {
            // merge settings
            const result = Object.assign(settings, {password: preparedData.newPassword});

            // write result
            const stringResultConfigs = JSON.stringify(result, null, '\t');

            //fs.writeFileSync(DASHBOARD_ROOT_DIR + '/users-config.json', stringResultConfigs);
            const error = safelyFileWriterSync({ pathToTargetFile: DASHBOARD_ROOT_DIR + '/users-config.json', dataForSave: stringResultConfigs, logger });
            if (error) {
                return {result: false, message: error}
            }
            return {result: true, message: 'success'}
        } else {
            logger.warn('current_password_is_different')
            return {result: false, message: 'current_password_is_different'}
        }
    }

    return validationResult;
}

exports.writePasswordSettings = writePasswordSettings;
