const fs = require('fs');

const readPreset = ({presetName, serverDirName, logger}) => {
    logger.silly('readPreset');
    return new Promise((resolve, reject) => {
        const presetList = JSON.parse(fs.readFileSync(serverDirName + '/LoRa-frequency-presets/list.json', 'utf8'));
        const selectedPreset = presetList[presetName];
        logger.info(`Selected preset "${presetName}"`);
        if (selectedPreset !== undefined) {
            const presetFileName = selectedPreset.fileName;
            fs.access(serverDirName + `/LoRa-frequency-presets/presets/${presetFileName}`, (error) => {
                if (error) {
                    logger.warn(`File "${presetFileName}" not found!`);
                    return resolve({isSuccess: false, msg: 'file_not_found', data: `File "${presetFileName}" not found!`});
                } else {
                    const presetConfigsText = fs.readFileSync(serverDirName + `/LoRa-frequency-presets/presets/${presetFileName}`, 'utf8');
                    const presetConfigs = isJsonString(presetConfigsText);

                    if (presetConfigs) {
                        logger.silly(presetConfigs);
                        return resolve({isSuccess: true, data: presetConfigs});
                    } else {
                        logger.warn(`File "${presetFileName}" has not valid JSON!`);
                        return resolve({isSuccess: false, msg: 'file_has_not_valid_json', data: `File "${presetFileName}" has not valid JSON!`});
                    }
                }
            });
        } else {
            logger.warn(`selectedPreset = ${selectedPreset} of [${presetName}]`);
            return resolve({isSuccess: false, msg: 'selected_preset_is_undefined', data: `ERROR: selectedPreset = ${selectedPreset} of [${presetName}]`});
        }
    })
}

const isJsonString = (str) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return false;
    }
}

exports.readPreset = readPreset;
