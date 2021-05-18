const fs = require('fs');
const removeComentsFromLoraGlobalConf = require('../rm-cmnts-from-lora-globalconf.js').removeComentsFromLoraGlobalConf;
const parseObjectByMask = require('../parse-object-by-mask.js').parseObjectByMask;

const readConfig = ({SETTINGS, dataMask=null, logger}) => {
    logger.debug('lora-configs-file-actions/readConfig');
    const globalConfigFilePath = SETTINGS.loraGlobalConfigs.filePath + SETTINGS.loraGlobalConfigs.fileName;
    const localConfigFilePath = SETTINGS.loraGlobalConfigs.filePath + 'local_conf.json';

    //read files
    let localConf = {};
    try {
        const localConfText = fs.readFileSync(localConfigFilePath, 'utf8');
    	const localConfClearedText = removeComentsFromLoraGlobalConf(localConfText, '/*', '*/')
    	localConf = JSON.parse(localConfClearedText);
        logger.debug('local conf file is exists');
    } catch (e) {
        localConf = {};
        logger.debug('local conf file is do not exists');
    }

	const globalConfText = fs.readFileSync(globalConfigFilePath, 'utf8');
	const globalConfClearedText = removeComentsFromLoraGlobalConf(globalConfText, '/*', '*/')
	const globalConf = JSON.parse(globalConfClearedText);


    // Merge local conf into global conf only fields which is existed in global conf
    const mergedConfigs = parseObjectByMask(localConf, globalConf);


    // Fetch data by mask
    let resultConfigs = {};
    if (dataMask !== null) {
        resultConfigs = parseObjectByMask(mergedConfigs, dataMask, false);
    } else {
        resultConfigs = mergedConfigs;
    }


	logger.silly(resultConfigs);
	return resultConfigs;
}

exports.readConfig = readConfig;
