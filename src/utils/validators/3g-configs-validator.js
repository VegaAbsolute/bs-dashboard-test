const stringValidator = require('../validators').stringValidator;
const providerPhoneValidator = require('../validators').providerPhoneValidator;
const namePassValidator = require('../validators').namePassValidator;
const ipValidator = require('../validators').ipValidator;

const deepReduceObject = require('../objects-utils/deep-reduce-object.js').deepReduceObject;

const oneParamValidator = (field, value) => {
    switch (field) {
        case 'Init2': {
            return stringValidator(value, 1, 64);
        }
        case 'Phone': {
            return providerPhoneValidator(value);
        }
        case 'Password':
        case 'Username': {
            return namePassValidator(value);
        }
        case 'REF_IP1': {
            return ipValidator(value);
        }
        case 'REF_IP2': {
            if (value === '') {
                return true;
            } else {
                return ipValidator(value);
            }
        }
        default: {
            return false;
        }
    }
}

const $3GConfigsValidator = (data, logger) => {
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

exports.$3GConfigsValidator = $3GConfigsValidator;
