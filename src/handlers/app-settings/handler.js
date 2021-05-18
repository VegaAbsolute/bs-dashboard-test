const appSettingsHandler = ({
    request,
    response,

    logger,
    Session,
    getLastVersionData,

    getState,
    appParams
}) => {
    logger.debug('appSettingsHandler');

    try {
        const { cmd = '', data = {}, loginToken = '' } = request.body;
        const {
            SETTINGS,
            PROD_INFO,
            DASHBOARD_ROOT_DIR,
            SERVER_PACKAGE
        } = appParams;

        logger.info(`cmd = ${cmd}`, 0, true);
        logger.silly(data);

        if (!Session.checkToken(loginToken, request.headers.origin)) {
            logger.warn('login_incorrect');
            response.json({ cmd, result: false, msg: 'login_not_performed' });
            return;
        }

        logger.info('login_correct');

        switch (cmd) {
            /**
             * Manager settings
             */
            case 'get_manager_settings': {
                logger.silly('handler case: get_manager_settings');
                const readManagerSettings = require('./read-manager-settings.js').readManagerSettings;
                const result = readManagerSettings(DASHBOARD_ROOT_DIR)(logger);
                response.json({ cmd, result: true, data: result });
                break;
            }


            case 'set_manager_settings': {
                logger.silly('handler case: set_manager_settings');
                const writeManagerSettings = require('./write-manager-settings.js').writeManagerSettings;
                const writeResult = writeManagerSettings(DASHBOARD_ROOT_DIR, data)(logger);

                if (writeResult.isValid) {
                    response.json({ cmd, result: true, msg: 'success' });
                } else {
                    if (writeResult.result === 'error') {
                        response.json({ cmd, result: false, msg: 'error', data: writeResult.message });
                    } else {
                        response.json({ cmd, result: false, msg: 'data_is_not_valid', data: writeResult.msg });
                    }
                }
                break;
            }


            /**
             * Dashboard settings
             */
            case 'get_dashboard_settings': {
                logger.silly('handler case: get_dashboard_settings');
                const readDasboardSettings = require('./read-dashboard-settings.js').readDasboardSettings;
                const result = readDasboardSettings(DASHBOARD_ROOT_DIR)(logger);
                response.json({ cmd, result: true, data: result });
                break;
            }


            case 'set_dashboard_settings': {
                logger.silly('handler case: set_dashboard_settings');
                const writeDashboardSettings = require('./write-dashboard-settings.js').writeDashboardSettings;
                const writeResult = writeDashboardSettings(DASHBOARD_ROOT_DIR, data)(logger);

                if (writeResult.isValid) {
                    response.json({ cmd, result: true, msg: 'success' });
                } else {
                    if (writeResult.result === 'error') {
                        response.json({ cmd, result: false, msg: 'error', data: writeResult.message });
                    } else {
                        response.json({ cmd, result: false, msg: 'data_is_not_valid', data: writeResult.msg });
                    }
                }
                break;
            }


            /**
             * Password setttings
             */
            case 'set_password_settings': {
                logger.silly('handler case: set_password_settings');
                const writePasswordSettings = require('./write-password-settings.js').writePasswordSettings;
                const result = writePasswordSettings(DASHBOARD_ROOT_DIR, data)(logger);

                if (result.result) {
                    response.json({ cmd, result: true, msg: 'success' });
                } else {
                    response.json({ cmd, result: false, msg: 'failure', data: result.message });
                }
                break;
            }

            default: {
                logger.silly('handler case: default');
                logger.warn('unknown_command');
                response.json({ cmd, result: false, msg: 'unknown_command' });
            }
        }
    } catch (error) {
        logger.error(error.name + "\n\r" + error.message + "\n\r" + error.stack);
        response.json({ cmd: 'SERVER_ERROR', result: false, msg: 'SERVER ERROR: [' + error.name + '] -' + error.message });
    }
}

exports.handler = appSettingsHandler;
