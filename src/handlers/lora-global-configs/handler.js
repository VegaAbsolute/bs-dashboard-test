const loraGlobalConfigsHandler = ({
    request,
    response,

    logger,
    Session,
    getLastVersionData,

    getState,
    appParams
}) => {
    logger.debug('loraGlobalConfigsHandler');

    try {
        const { cmd = '', data = {}, loginToken = '' } = request.body;
        const {
            SETTINGS,
            PROD_INFO,
            DASHBOARD_ROOT_DIR,
            SERVER_PACKAGE,
            dirName
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
            case 'get_global_conf': {
                logger.silly('handler case: get_global_conf');
                const dataMask = {
                    gateway_conf: {
                        gateway_ID: null,
                        server_address: null,
                        serv_port_up: null,
                        serv_port_down: null
                    }
                };
                const readConfig = require('../../utils/lora-config-files-actions/read-config.js').readConfig;
                const configs = readConfig({ SETTINGS, dataMask, logger });
                const result = {
                    cmd: 'get_global_conf',
                    result: true,
                    msg: 'success',
                    data: configs
                }
                response.json(result);
                break;
            }



            case 'set_global_conf': {
                logger.silly('handler case: set_global_conf');
                const dataMask = {
                    gateway_conf: {
                        server_address: null,
                        serv_port_up: null,
                        serv_port_down: null
                    }
                };

                const writeConfig = require('../../utils/lora-config-files-actions/write-config.js').writeConfig;
                const validator = require('../../utils/validators/lora-global-conf-validator.js').globalConfValidator;
                const writeResult = writeConfig({ SETTINGS, data: { gateway_conf: data }, dataMask, logger, validator });

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

exports.handler = loraGlobalConfigsHandler;
