const read = require('../../utils/lora-config-files-actions/read-config.js').readConfig;
const parseObjectByMask = require('../../utils/parse-object-by-mask.js').parseObjectByMask;



const readConfig = ({SETTINGS, PROD_INFO, logger}) => {
    logger.silly('readConfig');

    let softwareRevision = 1;
    let tempSoftwareRevision = NaN;

    let validPROD_INFO = typeof PROD_INFO === 'object' && PROD_INFO !== null;
    let validSoftwareRevision = validPROD_INFO && PROD_INFO.Software_revision;
    if(validSoftwareRevision) tempSoftwareRevision = parseInt(PROD_INFO.Software_revision);
    

    const dataMask = {
        gateway_conf:{
            ref_latitude: 0,
            ref_longitude: 0,
            ref_altitude: 0,
            fake_gps: false
        }
    };

    const fullConfigs = read({SETTINGS, logger});
    let sendConfigs = parseObjectByMask(fullConfigs, dataMask, true).gateway_conf;

    if ( softwareRevision >= 2 ) sendConfigs.use_gps = (fullConfigs.gateway_conf.gps_tty_path === '/dev/ttyS1') ? 'enabled' : 'disabled';
    else sendConfigs.use_gps = (fullConfigs.gateway_conf.gps_tty_path === '/dev/ttyO1') ? 'enabled' : 'disabled';

    logger.silly(sendConfigs);
    return sendConfigs;
}

exports.readConfig = readConfig;
