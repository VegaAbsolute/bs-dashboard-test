const read = require('../../utils/lora-config-files-actions/read-config.js').readConfig;

const readConfig = ({SETTINGS, logger}) => {
	logger.silly('readConfig');

    const dataMask = {
        SX1301_conf: {
            radio_0: {
                freq: null
            },
            radio_1: {
                freq: null
            },
            chan_multiSF_0: {
                enable: null,
                radio: null,
                if: null
            },
            chan_multiSF_1: {
                enable: null,
                radio: null,
                if: null
            },
            chan_multiSF_2: {
                enable: null,
                radio: null,
                if: null
            },
            chan_multiSF_3: {
                enable: null,
                radio: null,
                if: null
            },
            chan_multiSF_4: {
                enable: null,
                radio: null,
                if: null
            },
            chan_multiSF_5: {
                enable: null,
                radio: null,
                if: null
            },
            chan_multiSF_6: {
                enable: null,
                radio: null,
                if: null
            },
            chan_multiSF_7: {
                enable: null,
                radio: null,
                if: null
            },
            chan_Lora_std: {
                enable: null,
                radio: null,
                if: null,
                bandwidth: null,
                spread_factor: null
            },
            chan_FSK: {
                enable: null,
                radio: null,
                if: null,
                bandwidth: null,
                datarate: null
            }
        }
    }

    const sendConfigs = read({SETTINGS, dataMask, logger});
	logger.silly(sendConfigs);
	return sendConfigs;
}

exports.readConfig = readConfig;
