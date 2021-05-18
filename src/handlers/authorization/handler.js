const authorizationHandler = ({
    request,
    response,

    logger,
    Session,
    getLastVersionData,

    getState,
    appParams
}) => {
    logger.debug('authorizationHandler');

    try {
        const { cmd = '', data = {} } = request.body;
        const {
            DASHBOARD_ROOT_DIR,
            ISSUPPORT3G
        } = appParams;
        const additionalDataResponse = {
            isSupport3G: ISSUPPORT3G
        }

        logger.info(`cmd = ${cmd}`);
        logger.silly(data);

        switch (cmd) {
            case 'login_request': {
                logger.silly('handler case: login_request');
                const userAuthentication = require('./user-authentication.js').userAuthentication;
                const userAuthenticationResult = userAuthentication({ Session, data, requestOrigin: request.headers.origin, logger, DASHBOARD_ROOT_DIR });
                let result;

                if (userAuthenticationResult.result === true) {
                    result = Object.assign({}, userAuthenticationResult, additionalDataResponse)
                } else {
                    result = Object.assign({}, userAuthenticationResult)
                }

                response.json(result);
                break;
            }
            case 'logout_request': {
                logger.silly('handler case: logout_request');
                Session.closeSession(JSON.parse(data));
                response.json({ cmd, result: true, msg: 'success' });
                break;
            }
            default: {
                logger.silly('handler case: default');
                logger.warn('unknown_command')
                response.json({ cmd, result: false, msg: 'unknown_command' });
            }
        }
    } catch (error) {
        logger.error(error.name + "\n\r" + error.message + "\n\r" + error.stack);
        response.json({ cmd: 'SERVER_ERROR', result: false, msg: 'SERVER ERROR: [' + error.name + '] -' + error.message });
    }
}

exports.handler = authorizationHandler;
