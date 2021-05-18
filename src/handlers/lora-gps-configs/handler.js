const handler = ({
    request,
    response,

    logger,
    Session,
    getLastVersionData,

    getState,
    appParams
}) => {
    logger.debug('loraGpsConfigsHandler');

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
            case 'get_lora_gps_conf': {
                logger.silly('handler case: get_lora_gps_conf');
                const readConfig = require('./read-config.js').readConfig;

                const configs = readConfig({ SETTINGS, PROD_INFO, logger });
                const result = {
                    cmd,
                    result: true,
                    msg: 'success',
                    data: configs
                }
                response.json(result);
                break;
            }

            case 'set_lora_gps_conf': {
                logger.silly('handler case: set_lora_gps_conf');
                const writeConfig = require('./write-config.js').writeConfig;
                const writeResult = writeConfig({ SETTINGS, PROD_INFO, data, logger });

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

exports.handler = handler;
