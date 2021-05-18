const initialHandler = ({
    request,
    response,

    logger,

    getState,
    appParams
}) => {
    logger.debug('initialHandler');

    try {
        const { cmd = '', data = {} } = request.body;
        const {
            SETTINGS,
            PROD_INFO,
            DASHBOARD_ROOT_DIR,
            SERVER_PACKAGE,
            dirName
        } = appParams;

        logger.info(`cmd = ${cmd}`);
        logger.silly(data);

        switch (cmd) {
            case 'fetch_language': {
                logger.silly('handler case: fetch_language');
                const { language } = SETTINGS.serverConfigs;
                logger.silly(language);
                response.json({ cmd, result: true, data: language });
                break;
            }

            case 'set_language': {
                logger.silly('handler case: set_language');
                const setLanguage = require('./set-language.js').setLanguage
                setLanguage({ SETTINGS, response, cmd, logger, data, filePath: dirName + '/settings.json' })
                break;
            }

            default: {
                logger.silly('handler case: default');
                logger.error(cmd + ' - unknown_command');
                response.json({ cmd, result: false, msg: 'unknown_command' });
            }
        }
    } catch (error) {
        logger.error(error.name + "\n\r" + error.message + "\n\r" + error.stack);
        response.json({ cmd: 'SERVER_ERROR', result: false, msg: 'SERVER ERROR: [' + error.name + '] -' + error.message });
    }
}

exports.handler = initialHandler;
