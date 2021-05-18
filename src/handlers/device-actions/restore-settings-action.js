const fs = require('fs');

const restoreSettingsAction = (destinationDir, filePath, fileName, logger) => (next) => {
    if ( !filePath && !fileName ) return next;
    logger.verbose('Check buckup for: ' + fileName);
    const result = fs.existsSync(destinationDir + '/' + fileName);
    if (result) {
        logger.verbose(`Backup for file "${fileName}" is exists.`);
        return copyFile(destinationDir, filePath, fileName, logger)(next);
    } else {
        logger.warn(`Backup for file "${fileName}" not found.`);
        return next;
    }
}

const copyFile = (destinationDir, filePath, fileName, logger) => (next) => {
    logger.verbose('Restore backup for: ' + fileName);
    // Copy file
    fs.writeFileSync(filePath + fileName, fs.readFileSync(destinationDir + '/' + fileName));
    return next;
}

exports.restoreSettingsAction = restoreSettingsAction;
