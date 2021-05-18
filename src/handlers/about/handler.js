const aboutHandler = ({
    request,
    response,

    logger,
    Session,
    getLastVersionData,

    getState,
    appParams
}) => {
    logger.debug('aboutHandler');
    try {
        const { cmd = '', data = {}, loginToken = '' } = request.body;
        const {
            SETTINGS,
            PROD_INFO,
            DASHBOARD_ROOT_DIR,
            SERVER_PACKAGE
        } = appParams;

        const { lastVersionData, managerVersion } = getLastVersionData();

        logger.info(`cmd = ${cmd}`, 0, true);
        logger.silly(data);

        if (!Session.checkToken(loginToken, request.headers.origin)) {
            logger.warn('login_incorrect');
            response.json({ cmd, result: false, msg: 'login_not_performed' });
            return;
        }

        logger.info('login_correct');

        switch (cmd) {
            case 'fetch_about_info': {
                logger.silly('handler case: fetch_about_info');
                const fetchInfo = require('./fetch-info.js').fetchInfo;
                const result = fetchInfo({ version: SERVER_PACKAGE.version, managerVersion, lastVersionData, SETTINGS, PROD_INFO, logger });
                response.json({ cmd, result: true, data: result });
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

exports.handler = aboutHandler;
