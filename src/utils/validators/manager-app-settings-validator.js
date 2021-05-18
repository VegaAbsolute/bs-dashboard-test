const ipWithPortValidator = require('../validators').ipWithPortValidator;
const domainAdressWithoutProtocolValidator = require('../validators').domainAdressWithoutProtocolValidator;
const numberValidator = require('../validators').numberValidator;
const partOfUrlPathValidator = require('../validators').partOfUrlPathValidator;

const deepReduceObject = require('../objects-utils/deep-reduce-object.js').deepReduceObject;

const oneParamValidator = (field, value) => {
    switch (field) {
        case 'GIT_NAME':
        case 'GIT_REPO': {
            return partOfUrlPathValidator(value);
        }

        case 'GIT_DOMAIN': {
            let isValid = false;
            if (ipWithPortValidator(value)) {
                return true;
            } else if (domainAdressWithoutProtocolValidator(value)) {
                return true;
            } else if (value === 'localhost') {
                return true;
            }
            return false
        }

        case 'GIT_PROVIDER': {
            switch (value) {
                case 'GIT_LAB':
                case 'GIT_HUB': {
                    return true;
                }
                default: {
                    return false;
                }
            }
        }

        case 'TIME_INTERVAL_IN_MINUTES': {
            return numberValidator(value, 0, 9999);
        }

        case 'loggerLevel': {
            if (typeof value === 'string') {
                return true;
            }
            return false;
        }

        case 'SERVER_STARTUP_METHOD': {
            switch (value) {
                case 'automatically':
                case 'button': {
                    return true;
                }
                default: {
                    return false;
                }
            };
        }


        default: {
            return false;
        }
    }
}


const appManagerSettingsValidator = (data, logger) => {
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

exports.appManagerSettingsValidator = appManagerSettingsValidator;
