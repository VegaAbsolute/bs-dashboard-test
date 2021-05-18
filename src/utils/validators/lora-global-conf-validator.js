const portValidator = require('../validators').portValidator;
const ipValidator = require('../validators').ipValidator;
const domainAdressValidator = require('../validators').domainAdressValidator;

const deepReduceObject = require('../objects-utils/deep-reduce-object.js').deepReduceObject;

const oneParamValidator = (field, value) => {
    let isValid;
    switch (field) {
        case 'serv_port_up':
        case 'serv_port_down': {
            isValid = portValidator(value);
            break;
        }
        case 'server_address': {
            isValid = false;
            if (ipValidator(value)) {
                isValid = true;
            } else if (domainAdressValidator(value)) {
                isValid = true;
            } else if (value === 'localhost') {
                isValid = true;
            }
            break;
        }
        default: {
            isValid = false;
        }
    }

    return isValid;
}

const globalConfValidator = ({data, logger}) => {
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

exports.globalConfValidator = globalConfValidator;
