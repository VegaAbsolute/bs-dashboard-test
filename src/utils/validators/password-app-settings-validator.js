const appPasswordSettingsValidator = (data, logger) => {
    if (data.length > 7 && data.length < 25) {
        logger.verbose('newPassword is valid = true');
        return {result: true, message: 'success'}
    } else {
        logger.warn('newPassword is valid = false: new_password_length_must_be_in_range_of_8_and_24');
        return {result: false, message: 'new_password_length_must_be_in_range_of_8_and_24'}
    }
}

exports.appPasswordSettingsValidator = appPasswordSettingsValidator;
