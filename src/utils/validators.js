const numberValidator = (number, min, max) => {
    if (typeof number !== 'number') {
        return false;
    }
    if (isNaN(number)) {
        return false;
    }
    if (number >= min && number <= max) {
        return true;
    }
    return false;
}

const portValidator = (number) => {
    return numberValidator(number, 0, 65535);
}

const ipValidator = (str) => {
    let workString = '' + str;
    let isValid = true;
    const ipArray = str.split(".");

    if (ipArray.length !== 4) {
        return false;
    }
    for (var i = 0; i < ipArray.length; i++) {
        const number = Number.parseInt(ipArray[i]);
        if (('' + number) !== ipArray[i]) {
            isValid = false;
            break;
        } else if (isNaN(number)) {
            isValid = false;
            break;
        } else if (number < 0 || number > 255) {
            isValid = false;
            break;
        }
    }
    return isValid;
}

const ipWithPortValidator = (text) => {
    const indexOfDoubleDot = text.indexOf(':');
    const ipText = indexOfDoubleDot > 0 ? text.substring(0, indexOfDoubleDot) : text;
    const portText = indexOfDoubleDot > 0 ? text.substring(indexOfDoubleDot + 1) : null;

    const ipValidResult = ipValidator(ipText);
    if (!ipValidResult) {
        return false;
    }
    if (indexOfDoubleDot > 0) {
        const portNum = Number.parseInt(portText);
        const portValidResult = portValidator(portNum);
        if (!portValidResult || ('' + portNum !== portText)) {
            return false;
        }
    }
    return true;
}

const netMaskValidator = (str) => {

    const binar = (number) => {
        let binarString = number.toString(2)
        const length = binarString.length;
        for (var i = 0; i < 8 - length; i += 1) {
            binarString = "0" + binarString;
        }
        return binarString;
    }

    const maskArrayString = str.split(".");
    if (maskArrayString.length !== 4) {
        return false;
    }

    let mask = '';
    for (var i = 0; i < maskArrayString.length; i++) {
        const number = Number.parseInt(maskArrayString[i]);
        if (('' + number) !== maskArrayString[i]) {
            return false;
        }
        if (isNaN(number)) {
            return false;
        } else if (number < 0 || number > 255) {
            return false;
        } else {
            mask += binar(number)
        }
    }
    //console.log('mask =' + mask, 2);

    let maskState = '1';
    for (var i = 0; i < mask.length; i++) {
        const currentMask = mask.substr(i, 1);
        switch (maskState) {
            case '1': {
                if (currentMask === '1') {

                } else if (currentMask === '0') {
                    maskState = '0';
                } else {
                    return false;
                }
                break;
            }
            case '0': {
                if (currentMask === '1') {
                    return false;
                } else if (currentMask === '0') {

                } else {
                    return false;
                }
                break;
            }
            default: {
                return false;
            }
        }
    }

    if (maskState === '1') {
        return false;
    }

    return true;
}

const domainAdressValidator = (str) => {
    if (str.length > 255) {
        return false
    }
    const re = /^(http[s]?:\/\/)?([a-z0-9]{1,1}[a-z0-9-]{0,63}[a-z0-9]{1,1}\.){1,4}[a-z]{2,4}(:[0-9]{1,5})?(\/[a-z0-9]{1,1}[a-z0-9-]{0,63}[a-z0-9]{1,1}){0,7}$/i;
    const valid = re.test(str);
    return valid;
}

const stringValidator = (string, minValid = 0, maxValid = 50) => {
    return (typeof string === 'string' ? (string.length >= minValid && string.length <= maxValid) : false);
}

const domainAdressWithoutProtocolValidator = (str) => {
    if (str.length > 255) {
        return false
    }
    const re = /^([a-z0-9]{1,1}[a-z0-9-]{0,63}[a-z0-9]{1,1}\.){1,4}[a-z]{2,4}(:[0-9]{1,5})?(\/[a-z0-9]{1,1}[a-z0-9-]{0,63}[a-z0-9]{1,1}){0,7}$/i;
    const valid = re.test(str);
    return valid;
}

const partOfUrlPathValidator = (str) => {
    const re = /^[a-z0-9]{1,1}[a-z0-9-]{0,63}[a-z0-9]{1,1}$/i;
    const valid = re.test(str);
    return valid;
}

const providerPhoneValidator = (str) => {
    const re = /^[*]{1,1}[0-9*#]+[#]{1,1}$/;
    const valid = re.test(str);
    return valid;
}

const namePassValidator = (str) => {
    const re = /^[a-z0-9]{1,16}$/i; //  i - игнорировать регистр
    const valid = re.test(str);
    return valid;
}

exports.domainAdressValidator = domainAdressValidator;
exports.domainAdressWithoutProtocolValidator = domainAdressWithoutProtocolValidator;
exports.stringValidator = stringValidator;
exports.partOfUrlPathValidator = partOfUrlPathValidator;
exports.providerPhoneValidator = providerPhoneValidator;
exports.namePassValidator = namePassValidator;
exports.portValidator = portValidator;
exports.ipValidator = ipValidator;
exports.ipWithPortValidator = ipWithPortValidator;
exports.netMaskValidator = netMaskValidator;
exports.numberValidator = numberValidator;
