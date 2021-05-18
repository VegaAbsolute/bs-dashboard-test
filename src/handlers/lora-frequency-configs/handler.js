const loraFrequencyConfigsHandler = ({
        request,
        response,

        logger,
        Session,

        getState,
        appParams
    }) => {
    logger.debug('loraFrequencyConfigsHandler');

    try {
        const { cmd = '', data = {}, loginToken = '' } = request.body;
        const {
            SETTINGS,
            PROD_INFO,
            DASHBOARD_ROOT_DIR,
            SERVER_PACKAGE,
            dirName: serverDirName
        } = appParams;

        logger.info(`cmd = ${cmd}`);
        logger.silly(data);

        if (!Session.checkToken(loginToken, request.headers.origin)) {
            logger.warn('login_incorrect');
            response.json({ cmd, result: false, msg: 'login_not_performed' });
            return;
        }

        logger.info('login_correct');

        switch (cmd) {

            case 'get_freq_conf': {
                logger.silly('handler case: get_freq_conf');

                const readConfig = require('./read-configs.js').readConfig;
                const configs = readConfig({ SETTINGS, logger });
                const result = {
                    cmd,
                    result: true,
                    msg: 'success',
                    data: configs
                }
                response.json(result);
                break;
            }


            case 'set_freq_conf': {
                logger.silly('handler case: set_freq_conf');
                const writeConfig = require('./write-config.js').writeConfig;
                const writeResult = writeConfig({ SETTINGS, data, logger });

                if (writeResult.isValid) {

                    // Reboot LoRa
                    if (SETTINGS.serverConfigs.isRebootLoraOnSaveConfigs) {
                        const exec = require('child_process').exec;
                        exec('killall lora_pkt_fwd', () => {
                            logger.info('Reboot LoRa.');
                        });
                    }

                    response.json({ cmd, result: true, msg: 'success' });
                } else {
                    response.json({ cmd, result: false, msg: 'data_is_not_valid', data: writeResult.msg });
                }
                break;
            }


            case 'get_freq_preset_list': {
                logger.silly('handler case: get_freq_preset_list');
                const getFrequencyPresetList = require('./get-preset-list.js').getFrequencyPresetList;
                const configs = getFrequencyPresetList({ serverDirName, logger });
                const result = {
                    cmd,
                    result: true,
                    msg: 'success',
                    data: configs
                }
                response.json(result);
                break;
            }


            // TODO: create preset sending
            case 'get_freq_preset': {
                logger.silly('handler case: get_freq_preset');
                const readPreset = require('./read-preset.js').readPreset;
                readPreset({ presetName: data.presetName, serverDirName, logger }).then((configs) => {
                    if (configs.isSuccess) {
                        const result = {
                            cmd,
                            result: true,
                            msg: 'success',
                            data: configs.data
                        }
                        response.json(result);
                    } else {
                        response.json({ cmd, result: false, msg: configs.msg });
                        // TODO: add transmit data in following API version
                        //response.json({ cmd, result: false, msg: configs.msg, data: configs.data });
                    }
                })
                break;
            }


            case 'set_freq_preset': {
                logger.silly('handler case: set_freq_preset');
                const setFrequencyPreset = require('./set-preset.js').setFrequencyPreset;
                //setFrequencyPreset(filePath);
                setFrequencyPreset({ SETTINGS, data, serverDirName, logger }).then((res) => {
                    if (res) {

                        // Reboot LoRa
                        if (SETTINGS.serverConfigs.isRebootLoraOnSaveConfigs) {
                            const exec = require('child_process').exec;
                            exec('killall lora_pkt_fwd', () => {
                                logger.info('Reboot LoRa.');
                            });
                        }

                        response.json({ cmd, result: true, msg: 'success' });
                    } else {
                        response.json({ cmd, result: false, msg: 'failure' });
                    }
                })
                break;
            }


            default: {
                logger.silly('handler case: default');
                logger.warn(cmd + ' - unknown_command');
                response.json({ cmd, result: false, msg: 'unknown_command' });
            }
        }
    } catch (error) {
        logger.error(error.name + "\n\r" + error.message + "\n\r" + error.stack);
        response.json({ cmd: 'SERVER_ERROR', result: false, msg: 'SERVER ERROR: [' + error.name + '] -' + error.message });
    }
}

exports.handler = loraFrequencyConfigsHandler;
