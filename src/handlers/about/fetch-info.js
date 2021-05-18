const os = require('os');
const fs = require('fs');

const fetchInfo = ({version, managerVersion, lastVersionData, SETTINGS, PROD_INFO, logger}) => {
    const loraVersionFilePath = SETTINGS.loraVersionFile.fileDir + SETTINGS.loraVersionFile.fileName;
    const loraVersion = fs.readFileSync(loraVersionFilePath, 'utf8')

    logger.silly('fetchInfo');
    const result = {
        device: PROD_INFO,
        lora: {
            version: loraVersion
        },
        server: {
            version: version,
            managerVersion: managerVersion.message,
            update: lastVersionData
        },
        os: {
            type: os.type(),
            arch: os.arch(),
            release: os.release(),
            platform: os.platform(),
        }
    }

    return result;
}

exports.fetchInfo = fetchInfo;
