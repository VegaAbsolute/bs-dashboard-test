const $3gConfigsHandler = ({
    request,
    response,

    logger,
    Session,

    getState,
    appParams
}) => {
    logger.debug('$3gConfigsHandler');
    try {
        const { cmd = '', data = {}, loginToken = '' } = request.body;
        const PROD_INFO = appParams.PROD_INFO;
        const { fileDir, fileName, interfaceManagerFileDir, interfaceManagerFileName } = appParams.SETTINGS.wireless3GConfigs;
        const filePath = fileDir + fileName;
        const interfaceManagerFilePath = interfaceManagerFileDir + interfaceManagerFileName;

        let softwareRevision = 1;
        let tempSoftwareRevision = NaN;

        let validPROD_INFO = typeof PROD_INFO === 'object' && PROD_INFO !== null;
        let validSoftwareRevision = validPROD_INFO && PROD_INFO.Software_revision;
        if(validSoftwareRevision) tempSoftwareRevision = parseInt(PROD_INFO.Software_revision);
        if(!isNaN(tempSoftwareRevision)) softwareRevision = tempSoftwareRevision;

        logger.info(`cmd = ${cmd}`, 0, true);
        logger.silly(data);

        if (!Session.checkToken(loginToken, request.headers.origin)) {
            logger.warn('login_incorrect');
            response.json({ cmd, result: false, msg: 'login_not_performed' });
            return;
        }

        logger.info('login_correct');

        switch (cmd) {
            case 'get_3g_conf': {
                logger.silly('handler case: get_3g_conf');
                const readConfig = require('./read-config.js').readConfig;
                const configs = readConfig({softwareRevision, filePath, interfaceManagerFilePath, logger });
                const result = {
                    cmd,
                    result: true,
                    msg: 'success',
                    data: configs
                }
                response.json(result);
                break;
            }

            case 'set_3g_conf': {
                logger.debug('handler case: set_3g_conf');
                const writeConfig = require('./write-config.js').writeConfig;
                const writeResult = writeConfig({ softwareRevision, filePath, interfaceManagerFilePath, data, logger });

                if (writeResult.isValid) {
                    response.json({ cmd, result: true, msg: 'success' });
                } else {
                    response.json({ cmd, result: false, msg: 'data_is_not_valid', data: writeResult.msg });
                }
                break;
            }

            default: {
                logger.debug('handler case: default');
                logger.warn('unknown_command');
                response.json({ cmd, result: false, msg: 'unknown_command' });
            }
        }
    } catch (error) {
        logger.error(error.name + "\n\r" + error.message + "\n\r" + error.stack);
        response.json({ cmd: 'SERVER_ERROR', result: false, msg: 'SERVER ERROR: [' + error.name + '] -' + error.message });
    }
}

exports.handler = $3gConfigsHandler;
