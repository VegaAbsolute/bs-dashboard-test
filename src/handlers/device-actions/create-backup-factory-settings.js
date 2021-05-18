const fs = require('fs');
const compose = require('../../utils/compose.js').compose;

const createBackupFactorySettings = (SETTINGS, PROD_INFO, backupDir, logger, next) => {
    logger.info('Check backup factory settings files.');
    
    let softwareRevision = 1;
    let tempSoftwareRevision = NaN;

    let validPROD_INFO = typeof PROD_INFO === 'object' && PROD_INFO !== null;
    let validSoftwareRevision = validPROD_INFO && PROD_INFO.Software_revision;
    if(validSoftwareRevision) tempSoftwareRevision = parseInt(PROD_INFO.Software_revision);
    if(!isNaN(tempSoftwareRevision)) softwareRevision = tempSoftwareRevision;

    let dnsFileDir = SETTINGS.networkConfigs.fileDir;
    let validSettingsNetworkConfigs = typeof SETTINGS.networkConfigs === 'object' && SETTINGS.networkConfigs !== null;
    let validSettingDnsFileDir = validSettingsNetworkConfigs && typeof SETTINGS.networkConfigs.DnsFileDir === 'string' && SETTINGS.networkConfigs.DnsFileDir;
    if( validSettingDnsFileDir ) dnsFileDir = SETTINGS.networkConfigs.DnsFileDir;
    
    const f = compose(
        checkForFileExist(
            backupDir,
            SETTINGS.loraGlobalConfigs.filePath,
            SETTINGS.loraGlobalConfigs.fileName,
            logger),
        checkForFileExist(
            backupDir,
            SETTINGS.loraGlobalConfigs.filePath,
            'local_conf.json',
            logger),
        checkForFileExist(
            backupDir,
            SETTINGS.networkConfigs.fileDir,
            SETTINGS.networkConfigs.fileName,
            logger),
        checkForFileExist(
            backupDir,
            dnsFileDir,
            SETTINGS.networkConfigs.DnsFileName,
            logger),
        checkForFileExist(
            backupDir,
            SETTINGS.wireless3GConfigs.fileDir,
            SETTINGS.wireless3GConfigs.fileName,
            logger),

        checkForFileExist(
            backupDir,
            SETTINGS.wireless3GConfigs.interfaceManagerFileDir,
            SETTINGS.wireless3GConfigs.interfaceManagerFileName,
            logger)

    )(next);

    f();
}

const checkForFileExist = (destinationDir, filePath, fileName, logger) => (next) => {
    if ( !filePath && !fileName ) return next;
    logger.verbose('Check buckup for: ' + fileName);

    const result = fs.existsSync(destinationDir + '/' + fileName);
    if (result) {
        logger.verbose(`Backup for file "${fileName}" is exists.`);
        return next;
    } else {
        logger.verbose(`Backup for file "${fileName}" not found.`);
        return createBackup(destinationDir, filePath, fileName, logger)(next);
    }
}

const mkdirSync = function (dirPath) {
  try {
    fs.mkdirSync(dirPath)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

const createBackup = (destinationDir, filePath, fileName, logger) => (next) => {
    logger.verbose('Create backup for: ' + fileName);
    const isExistsRequiredFile = fs.existsSync(filePath + fileName);
    if (isExistsRequiredFile) {
        mkdirSync(destinationDir);
        // Copy file
        fs.writeFileSync(destinationDir + '/' + fileName, fs.readFileSync(filePath + fileName));
        return next;
    } else {
        logger.error(`Source file not found! - ` + filePath + fileName);
        return next;
        // You can return empty function to forbid start the server when create backups has errors.
        //return () => {}
    }
}

exports.createBackupFactorySettings = createBackupFactorySettings;
