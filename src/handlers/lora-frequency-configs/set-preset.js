const fs = require('fs');
const mergeDeep =  require('../../utils/merge-deep.js').mergeDeep;
const removeComentsFromLoraGlobalConf = require('../../utils/rm-cmnts-from-lora-globalconf.js').removeComentsFromLoraGlobalConf;
const write = require('../../utils/lora-config-files-actions/write-config.js').writeConfig;

const setFrequencyPreset = ({SETTINGS, data, serverDirName, logger}) => {
    logger.silly('setFrequencyPreset');
    const { presetName } = data;
    return new Promise((resolve, reject) => {
        const presetList = JSON.parse(fs.readFileSync(serverDirName + '/LoRa-frequency-presets/list.json', 'utf8'));
        const selectedPreset = presetList[presetName];
        logger.info(`Selected preset "${presetName}"`);
        if (selectedPreset !== undefined) {
            const presetFileName = selectedPreset.fileName;
            fs.access(serverDirName + `/LoRa-frequency-presets/presets/${presetFileName}`, (error) => {
                if (error) {
                    logger.warn(`File "${presetFileName}" not found!`);
                    return resolve(false);
                } else {

                    const presetConfigs = {
                        SX1301_conf: JSON.parse(fs.readFileSync(serverDirName + `/LoRa-frequency-presets/presets/${presetFileName}`, 'utf8'))
                    };

                    write({
                        SETTINGS,
                        data: presetConfigs,
                        logger,
                        validator: ()=>{return {isValid: true};}
                    });

                    return resolve(true);
                }
            });
        } else {
            logger.warn(`selectedPreset = ${selectedPreset} of [${presetName}] in `, presetList);
            return resolve(false);
        }
    })
}

exports.setFrequencyPreset = setFrequencyPreset;
