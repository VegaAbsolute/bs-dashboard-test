const write = require('../../utils/lora-config-files-actions/write-config.js').writeConfig;
const frequencyConfigsValidator = require('../../utils/validators/frequency-configs-validator.js').frequencyConfigsValidator;
const additionalChannelsValidator = require('../../utils/validators/frequency-configs-validator.js').additionalChannelsValidator;
const parseObjectByMask = require('../../utils/parse-object-by-mask.js').parseObjectByMask;
const mergeDeep = require('../../utils/merge-deep.js').mergeDeep;

const writeConfig = ({ SETTINGS, data: configs, logger }) => {
    logger.silly('writeConfig');
    const newConfigsMask = {
        radio_0: { freq: null },
        radio_1: { freq: null },
        chan_multiSF_0: {
            enable: null,
            if: null,
            radio: null,
        },
        chan_multiSF_1: {
            enable: null,
            if: null,
            radio: null,
        },
        chan_multiSF_2: {
            enable: null,
            if: null,
            radio: null,
        },
        chan_multiSF_3: {
            enable: null,
            if: null,
            radio: null,
        },
        chan_multiSF_4: {
            enable: null,
            if: null,
            radio: null,
        },
        chan_multiSF_5: {
            enable: null,
            if: null,
            radio: null,
        },
        chan_multiSF_6: {
            enable: null,
            if: null,
            radio: null,
        },
        chan_multiSF_7: {
            enable: null,
            if: null,
            radio: null,
        }
    };
    const additionalChannelsMask = {
        chan_FSK: {
            bandwidth: null,
            datarate: null,
            enable: null,
            if: null,
            radio: null
        },
        chan_Lora_std: {
            bandwidth: null,
            spread_factor: null,
            enable: null,
            if: null,
            radio: null
        }
    };

    let newConfigs = {
        SX1301_conf: parseObjectByMask(configs, newConfigsMask, false)
    };
    const additionalChannels = parseObjectByMask(configs, additionalChannelsMask, false);

    // check for valid
    logger.silly(additionalChannels);
    const addChnValidationResult = additionalChannelsValidator(additionalChannels, logger);

    logger.silly(newConfigs);
    const frequencyValidationResult = frequencyConfigsValidator(newConfigs, logger);
    /*
{
        isDataValid: validationResult,
        descriptionOfNotValid
    }

    */

    const validateResult = addChnValidationResult.isValid && frequencyValidationResult.isDataValid;

    logger.info('Is valid new configs for write to "global_conf.json" = ' + validateResult);

    // merge configs and write to file
    const result = write({
        SETTINGS,
        data: mergeDeep({ SX1301_conf: additionalChannels }, newConfigs),
        logger,
        validator: () => {
            return {
                isValid: validateResult,
                msg: [...addChnValidationResult.msg, ...frequencyValidationResult.descriptionOfNotValid]
            }
        }
    });

    return result;
    /*
{
                isValid: validateResult,
                msg: [...addChnValidationResult.msg, ...frequencyValidationResult.descriptionOfNotValid]
            }
    */
}

exports.writeConfig = writeConfig;
