const fs = require('fs');
const parseObjectByMask = require('./utils/parse-object-by-mask.js').parseObjectByMask;
const readProdInfoFile = require('./read-prod-info-file.js').readProdInfoFile;

const readSettings = (MAIN_DIR, logger, next) => {
    let baseSettings = null;
    let pathRootSettings = '/src/root-settings.json';
    /**
     * Read PROD_INFO file
     */
    let prodInfo = readProdInfoFile();

    let softwareRevision = 1;
    let tempSoftwareRevision = NaN;
    let validPROD_INFO = typeof PROD_INFO === 'object' && PROD_INFO !== null;
    let validSoftwareRevision = validPROD_INFO && PROD_INFO.Software_revision;
    if(validSoftwareRevision) tempSoftwareRevision = parseInt(PROD_INFO.Software_revision);
    if(!isNaN(tempSoftwareRevision)) softwareRevision = tempSoftwareRevision;
    if ( softwareRevision >= 2 ) pathRootSettings = '/src/02-root-settings.json';




    try {
        const baseSettingsText = fs.readFileSync(MAIN_DIR + pathRootSettings, 'utf8');
        baseSettings = JSON.parse(baseSettingsText);
        logger.verbose('root-settings file was read successfully');
    } catch (e) {
        logger.error('root-settings file was read failure');
        logger.error(e);
    }


    if (baseSettings !== null) {
        let settings = {};
        try {
            const settingsText = fs.readFileSync(MAIN_DIR + '/settings.json', 'utf8');
            settings = JSON.parse(settingsText);
            logger.verbose('settings file was read successfully');
        } catch (e) {
            logger.warn('settings file was read failure');
            logger.warn(e);

            const newSettings = JSON.stringify(baseSettings, null, '\t');
            fs.writeFileSync(MAIN_DIR + '/settings.json', newSettings);
        }

        const mergedConfigs = parseObjectByMask(settings, baseSettings);
        
        //let addressProdInfo = '/home/root/PROD_INFO';

        
        next(undefined, mergedConfigs,prodInfo)
    } else {
        next('Fatal error! Cant read root-settings file!!', undefined, undefined)
    }
}

exports.readSettings = readSettings;
