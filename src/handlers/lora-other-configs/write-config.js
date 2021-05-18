const write = require('../../utils/lora-config-files-actions/write-config.js').writeConfig;
const validator = require('../../utils/validators/other-lora-conf-validator.js').otherLoraConfValidator;


const writeConfig = ({SETTINGS, data, logger}) => {
    logger.silly('writeConfig');

    const dataMask = {
        SX1301_conf: {
            antenna_gain: null
        },
        gateway_conf:{
            keepalive_interval: null
        }
    };

    const result = write({SETTINGS, data, dataMask, logger, validator})

    return result;
}

exports.writeConfig = writeConfig;
