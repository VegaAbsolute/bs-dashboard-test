const fs = require('fs');
const mergeDeep =  require('../../utils/merge-deep.js').mergeDeep;
const safelyFileWriterSync = require('../../utils/safely-file-writer').safelyFileWriterSync;

const setLanguage = ({SETTINGS, cmd, response, filePath, data, logger}) => {

    //prepare valid data
    const language = data.substr(0, 2);
    logger.silly(language);

    SETTINGS.serverConfigs.language = language;

    const text = fs.readFileSync(filePath, 'utf8');
    const previousConfigs = (JSON.parse(text));

    // merge configs and write to file
    const resultConfigs = mergeDeep(previousConfigs, {serverConfigs: { language }});

    const stringResultConfigs = JSON.stringify(resultConfigs, null, '\t');
    const error = safelyFileWriterSync({ pathToTargetFile: filePath, dataForSave: stringResultConfigs, logger });

    if (error) {
        response.json({ cmd, result: false, msg: "error", data: error })   
    } else {
        response.json({ cmd, result: true, msg: "success" })
    }
}

exports.setLanguage = setLanguage;
