
const deepReduceObject = require('../objects-utils/deep-reduce-object.js').deepReduceObject;

const oneParamValidator = (field, value) => {
    switch (field) {
        case 'isSupported': {
            switch (value) {
                case 'auto':
                case 'true':
                case 'false': {
                    return true;
                }
                default: {
                    return false;
                }
            }
        }
        case 'loggerLevel': {
            if (typeof value === 'string') {
                return true;
            }
            return false;
        }
        case 'isRebootLoraOnSaveConfigs': {
            return (typeof value === 'boolean');
        }

        default: {
            return false;
        }
    }
}


const dashboardAppSettingsValidator = (data, logger) => {
    const result = deepReduceObject(data, {isValid: true, msg: []}, (objectKeyPath, keyName, keyValue, prevResult)=>{
        const isValid = oneParamValidator(keyName, keyValue);

        if (!isValid) {
            logger.warn(`${objectKeyPath}.${keyName} is valid = ${isValid}`);
        } else {
            logger.verbose(`${objectKeyPath}.${keyName} is valid = ${isValid}`);
        };

        return {
            isValid: prevResult.isValid ? isValid : false,
            msg: isValid ? prevResult.msg : [...prevResult.msg, `[${objectKeyPath}.${keyName}]_is_not_valid`]
        }
    })

    return result;
}

exports.dashboardAppSettingsValidator = dashboardAppSettingsValidator;
