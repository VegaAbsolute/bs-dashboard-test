const fs = require('fs');

const getFrequencyPresetList = ({serverDirName, logger}) => {
    logger.silly('getFrequencyPresetList');
    const presets = JSON.parse(fs.readFileSync(serverDirName + '/LoRa-frequency-presets/list.json', 'utf8'));

    let presetList = [];
    for (let key in presets) {
        presetList = [
            ...presetList,
            {
                name: key,
                description: presets[key].description
            }
        ]
    }

    logger.silly(presetList);
    return presetList
}

exports.getFrequencyPresetList = getFrequencyPresetList;
