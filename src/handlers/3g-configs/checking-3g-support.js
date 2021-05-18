const fs = require('fs');

const checking3GSupport = (isSupported, interfaceManagerFilePath, logger) => {
    logger.debug('checking3GSupport');
    switch (isSupported) {
        case 'true': {
            logger.debug('case: true (true/false/auto)');
            return true;
        }
        case 'false': {
            logger.debug('case: false (true/false/auto)');
            return false;
        }
        case 'auto': {
            logger.debug('case: auto (true/false/auto)');
            const configsArray = fs.readFileSync(interfaceManagerFilePath, 'utf8').toString().split("\n");
            let configObject = {};
            for (var i in configsArray) {
                const string = configsArray[i].trim();
                if (string.substr(0, 1) !== "#" && string.substr(0, 1) !== "") {
                    const arr = string.split("=");
                    if(arr[0].trim() === 'INTERFACE2') {
                        if (arr[1].trim() === '"ppp0"') {
                            logger.debug('case: auto, return: true');
                            return true;
                        }
                    }
                }
            }
            logger.debug('case: auto, return: false');
            return false;
        }
        default: {
            logger.debug('case: default (true/false/auto)');
            return false;
        }
    }
}

exports.checking3GSupport = checking3GSupport;
