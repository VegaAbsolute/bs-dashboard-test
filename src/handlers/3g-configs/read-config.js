const fs = require('fs');

function parse3GConfig_r1 (filePath)
{
    const configsArray = fs.readFileSync(filePath, 'utf8').toString().split("\n");
    let result = {
        Init2: '',
        Phone: '',
        Password: '',
        Username: ''
    };

    for (var i in configsArray) {
        if (configsArray[i].substr(0, 1) !== ';') {
            const index = configsArray[i].indexOf('=');
            if (index > -1) {
                const field = configsArray[i].substring(0, index).trim();
                for (var key in result) {
                    if (key === field) {
                        let value = configsArray[i].substring(index + 1).split(",");
                        for (var j in value) {
                            value[j] = value[j].split('"').join('').trim();
                        }
                        result[key] = value[value.length - 1];
                    }
                }
            }
        }
    }
    return result;
}
function parse3GPingConfig_r1 (filePath)
{
    let result = {}
    const interfaceManagerFileArray = fs.readFileSync(filePath, 'utf8').toString().split("\n");
    // Fetch require configs
    for (var i in interfaceManagerFileArray) {
        const indexOfSeparator = interfaceManagerFileArray[i].indexOf('=');
        if (indexOfSeparator > 0) {
            const key = interfaceManagerFileArray[i].substring(0, indexOfSeparator).trim();
            const val = interfaceManagerFileArray[i].substring(indexOfSeparator + 1).trim().split('"').join('');
            switch (key) {
                case 'REF_IP1': {
                    result = Object.assign(result, {REF_IP1: val})
                    break;
                }
                case 'REF_IP2': {
                    result = Object.assign(result, {REF_IP2: val})
                    break;
                }
                default: {}
            }
        }
    }
    return result;
}
function parse3GConfig_r2 (filePath)
{
    let result = {
        configs:{
            Init2: '',
            Phone: '',
            Password: '',
            Username: ''
        },
        pingConfigs:{

        },
    }
    const arrConfigs = fs.readFileSync(filePath, 'utf8').toString().split("\n");
    for (let row of arrConfigs) 
    {
        let itemArr = row.trim().split('=');
        let key = itemArr[0];
        let val = itemArr[1];
        let validVal = typeof val === 'string' && val;
        let validKey = typeof key === 'string' && val;
        let active = false;
        if ( validKey ) 
        {
            active = key.indexOf('#') === -1;
            active = key.indexOf(';') === -1;
            key = key.trim().toLowerCase();
        }
        if ( validVal ) val = val.trim();
        if ( validKey && validVal && active )
        {
            if( key.indexOf('phone') !== -1 ) result.configs.Phone = val;
            else if( key.indexOf('username') !== -1 ) result.configs.Username = val;
            else if( key.indexOf('password') !== -1 ) result.configs.Password = val;
            else if( key.indexOf('apn') !== -1 ) result.configs.Init2 = val;
            else if( key.indexOf('refip1') !== -1 ) result.pingConfigs.REF_IP1 = val;
            else if( key.indexOf('refip2') !== -1 ) result.pingConfigs.REF_IP2 = val;    
        }
    }
    return result;
}

const readConfig = ({ softwareRevision, filePath, interfaceManagerFilePath, logger }) => {
    /**
     * Read main configs
     */
    let configs = {
        Init2: '',
        Phone: '',
        Password: '',
        Username: ''
    };
    let pingConfigs = {}
    if(softwareRevision>=2)
    {
        logger.debug('Read main configs and configs for ping');
        let data = parse3GConfig_r2(filePath);
        configs = data.configs;
        logger.silly(configs);
        pingConfigs = data.pingConfigs;
        logger.silly(pingConfigs);
    }
    else
    {
        logger.debug('Read main configs');
        configs = parse3GConfig_r1(filePath);
        logger.silly(configs);
        logger.debug('Read configs for ping');
        pingConfigs = parse3GPingConfig_r1(interfaceManagerFilePath);
        logger.silly(pingConfigs);
    }
    
	return Object.assign({}, configs, pingConfigs);
}

exports.readConfig = readConfig;
