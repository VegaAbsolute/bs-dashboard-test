const deepReduceObject = require('../objects-utils/deep-reduce-object.js').deepReduceObject;

const oneParamValidator = (fieldName, value) => {
    switch (fieldName) {
        case 'use_gps': {
            return (value === 'enabled' || value === 'disabled')
        }
        case 'fake_gps': {
            return (typeof value === 'boolean')
        }
        case 'ref_latitude':{
            if(typeof value !== 'number') {
                return false;
            }
            if (value > 90 || value < -90) {
                return false;
            }
            const re = /^[-]?[0-9]{1,3}([.]{1,1}[0-9]{1,5})?$/;
            return re.test('' + value);
        }
        case 'ref_longitude': {
            if(typeof value !== 'number') {
                return false;
            }
            if (value > 180 || value < -180) {
                return false;
            }
            const re = /^[-]?[0-9]{1,3}([.]{1,1}[0-9]{1,5})?$/;
            return re.test('' + value);
        }
        case 'ref_altitude': {
            if(typeof value !== 'number') {
                return false;
            }
            const re = /^[-]?[0-9]{1,6}$/;
            return re.test('' + value);
        }
        default: {
            return false;
        }
    }
}

const gpsLoraConfValidator = (data, logger) => {
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

exports.gpsLoraConfValidator = gpsLoraConfValidator;
