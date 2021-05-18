const compose = require('../../utils/compose.js').compose;
const restoreSettingsAction = require('./restore-settings-action.js').restoreSettingsAction;

const restoreLoraSettings = (SETTINGS, backupDir, logger, next) => {
    const f = compose(
        restoreSettingsAction(
            backupDir,
            SETTINGS.loraGlobalConfigs.filePath,
            SETTINGS.loraGlobalConfigs.fileName,
            logger),
        restoreSettingsAction(
            backupDir,
            SETTINGS.loraGlobalConfigs.filePath,
            'local_conf.json',
            logger)
    )(next);

    f();
}

exports.restoreLoraSettings = restoreLoraSettings;
