const read = require('../../utils/lora-config-files-actions/read-config.js').readConfig;


const readConfig = ({SETTINGS, logger}) => {
    logger.silly('readConfig');

    const dataMask = {
        SX1301_conf: {
            antenna_gain: null
        },
        gateway_conf:{
            keepalive_interval: null
        }
    };

    const result = read({SETTINGS, dataMask, logger})

    logger.silly(result);
    return result;
}

exports.readConfig = readConfig;
