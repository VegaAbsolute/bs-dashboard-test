const deepReduceObject = require('../objects-utils/deep-reduce-object.js').deepReduceObject;
const numberValidator = require('../validators.js').numberValidator;

/**
 * Check for valid additional radiochannels:
 */
const oneParamValidator = (field, value) => {
    switch (field) {
        case 'if':
        case 'bandwidth':
        case 'datarate':
        case 'spread_factor': {
            if (numberValidator(value, -999999999, 999999999)) {
                return true;
            }
            return false;
        }
        case 'radio': {
            if (value === 0 || value === 1) {
                return true;
            }
            return false;
        }
        case 'enable': {
            if (typeof value === 'boolean') {
                return true;
            }
            return false;
        }
        default: {
            return false;
        }
    }
}


const additionalChannelsValidator = (data, logger) => {
    const result = deepReduceObject(data, {isValid: true, msg: []}, (objectKeyPath, keyName, keyValue, prevResult)=>{
        const isValid = oneParamValidator(keyName, keyValue);

        if (!isValid) {
            logger.warn(`${objectKeyPath}.${keyName} is valid = ${isValid}`);
        } else {
            logger.verbose(`${objectKeyPath}.${keyName} is valid = ${isValid}`);
        };

        return {
            isValid: prevResult.isValid ? isValid : false,
            msg: isValid ? prevResult.msg : [...prevResult.msg, `[additional_radio_channels_validator]: [${objectKeyPath}.${keyName}]_is_not_valid`]
        }
    })

    return result;
}



/**
 * Check for valid main radiochannels:
 */
const frequencyConfigsValidator = ({SX1301_conf: obj}, logger) => {

    let data = {};
	let radios = {};
	for (var key in obj) {
		const fieldType = key.substr(0,4);
		switch (fieldType) {
			case 'chan': {
				data[key] = obj[key];
				break;
			}
			case 'radi': {
				radios[key] = obj[key];
				break;
			}
			default: {
				break;
			}
		}
	}

    let descriptionOfNotValid = [];
    let validationResult = true;
    let channels = [];

    for (let key in data) {
        if (data[key].enable) {
            /*
             *  Check elements to includes in the range of radio.
             */
            if (data[key].if < -400000 || data[key].if > 400000) {
                descriptionOfNotValid.push(`[main_radio_channels_validator]: ${'radio_'+data[key].radio}: [${key}: (${data[key].if})] not included in the range`);
                validationResult = false;
            };

            /*
             *  Check radios frequency valid
             */
            if (radios['radio_'+data[key].radio].freq < 863000000 || radios['radio_'+data[key].radio].freq > 925000000) {
                console.log('Check radios frequency valid');
                descriptionOfNotValid.push(`[main_radio_channels_validator]: Radio frequency = ${radios['radio_'+data[key].radio].freq} of the radio "${'radio_'+data[key].radio}" not included in the range (863000000 - 925000000)`);
                validationResult = false;
            };

            /*
             *  Fill channels array
             */
            channels = [
                ...channels,
                Object.assign({}, data[key], {
                    channelName: key,
                    if: data[key].if+radios['radio_'+data[key].radio].freq
                })
            ];
        }
    }

    /*
    *   Check intervals between elements
    */
    if (channels.length > 0) {
        channels.sort(( a, b ) =>  a.if - b.if).reduce((prev, current)=>{
            const diff = current.if - prev.if;
            if ((diff) < 200000) {
                validationResult = false;
                descriptionOfNotValid.push(`[main_radio_channels_validator]: [${prev.channelName}: ${prev.if}]<--${diff}-->[${current.channelName}: ${current.if}] interval smaller than 200000`);
            } else {
            }
            return current;
        })
    }

    if (validationResult) {
        logger.verbose(`[main_radio_channels_validator]: is valid = true`);
    } else {
        logger.warn(`[main_radio_channels_validator]: is valid = false`);
        logger.debug(descriptionOfNotValid);
    }

    return {
        isDataValid: validationResult,
        descriptionOfNotValid
    };
}

exports.frequencyConfigsValidator = frequencyConfigsValidator;
exports.additionalChannelsValidator = additionalChannelsValidator;
