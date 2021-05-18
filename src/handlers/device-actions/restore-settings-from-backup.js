const compose = require('../../utils/compose.js').compose;
const restoreSettingsAction = require('./restore-settings-action.js').restoreSettingsAction;

const restoreSettingsFromBackup = (SETTINGS,PROD_INFO, backupDir, logger, next) => {
   
    let dnsFileDir = SETTINGS.networkConfigs.fileDir;
    let validSettingsNetworkConfigs = typeof SETTINGS.networkConfigs === 'object' && SETTINGS.networkConfigs !== null;
    let validSettingDnsFileDir = validSettingsNetworkConfigs && typeof SETTINGS.networkConfigs.DnsFileDir === 'string' && SETTINGS.networkConfigs.DnsFileDir;
    if( validSettingDnsFileDir ) dnsFileDir = SETTINGS.networkConfigs.DnsFileDir;

    let softwareRevision = 1;
    let tempSoftwareRevision = NaN;

    let validPROD_INFO = typeof PROD_INFO === 'object' && PROD_INFO !== null;
    let validSoftwareRevision = validPROD_INFO && PROD_INFO.Software_revision;
    if(validSoftwareRevision) tempSoftwareRevision = parseInt(PROD_INFO.Software_revision);
    if(!isNaN(tempSoftwareRevision)) softwareRevision = tempSoftwareRevision;
   
    const f = compose(
        restoreSettingsAction(
            backupDir,
            SETTINGS.loraGlobalConfigs.filePath,
            SETTINGS.loraGlobalConfigs.fileName,
            logger),
        restoreSettingsAction(
            backupDir,
            SETTINGS.loraGlobalConfigs.filePath,
            'local_conf.json',
            logger),
        restoreSettingsAction(
            backupDir,
            SETTINGS.networkConfigs.fileDir,
            SETTINGS.networkConfigs.fileName,
            logger),
        restoreSettingsAction(
            backupDir,
            dnsFileDir,
            SETTINGS.networkConfigs.DnsFileName,
            logger),
        restoreSettingsAction(
            backupDir,
            SETTINGS.wireless3GConfigs.fileDir,
            SETTINGS.wireless3GConfigs.fileName,
            logger),
        restoreSettingsAction(
            backupDir,
            SETTINGS.wireless3GConfigs.interfaceManagerFileDir,
            SETTINGS.wireless3GConfigs.interfaceManagerFileName,
            logger)
    )(next);

    f();
}

exports.restoreSettingsFromBackup = restoreSettingsFromBackup;
