const numberValidator = require('../validators').numberValidator;

const deepReduceObject = require('../objects-utils/deep-reduce-object.js').deepReduceObject;

const oneParamValidator = (fieldPath, value) => {
    switch (fieldPath) {
        case 'Object.SX1301_conf.antenna_gain':
        case 'Object.gateway_conf.keepalive_interval': {
            return numberValidator(value, 0, 99999999);
        }
        default: {
            return false;
        }
    }
}

const otherLoraConfValidator = ({data, logger}) => {
    const result = deepReduceObject(data, {isValid: true, msg: []}, (objectKeyPath, keyName, keyValue, prevResult)=>{
        const isValid = oneParamValidator(`${objectKeyPath}.${keyName}`, keyValue);

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

exports.otherLoraConfValidator = otherLoraConfValidator;
