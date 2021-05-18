const getStateHandler = ({
    request,
    response,

    logger,
    Session,
    getLastVersionData,

    getState,
    appParams
}) => {
    logger.debug('getStateHandler');

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
            case 'get_update_state': {
                logger.silly('handler case: get_update_state');

                const { update } = getState();
                const result = {
                    cmd: 'get_update_state',
                    result: true,
                    msg: 'success',
                    data: update
                }
                response.json(result);

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

exports.handler = getStateHandler;
