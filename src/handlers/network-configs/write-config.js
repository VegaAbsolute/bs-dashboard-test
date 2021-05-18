const fs = require('fs');
const networkConfValidator = require('../../utils/validators/network-configs-validator.js').networkConfValidator;
const parseObjectByMask = require('../../utils/parse-object-by-mask.js').parseObjectByMask;
const parseNetworkConfig_r2 = require('../../handlers/network-configs/read-config.js').parseNetworkConfig_r2;

function writeNetworkConfig_r1 ( newConfigs, fileAddress )
{
    const strFileConfig = fs.readFileSync(fileAddress, 'utf8').toString();
    let validStrFileConfig = typeof strFileConfig === 'string';
    let validNewConfig = typeof newConfigs === 'object';
    if (!validStrFileConfig || !validNewConfig) return false;
    let networkConfigsArray = strFileConfig.split("\n");
    let beginNetworkConfigsBlock = -1;
    let endNetworkConfigsBlock = -1;
    for (var i in networkConfigsArray) {
        const isNotCommented = (networkConfigsArray[i].indexOf('#') === -1);

        // definition network configs block of 'eth0'
        if (isNotCommented) {
            if (networkConfigsArray[i].indexOf('iface') !== -1) {
                let deviceConfArray = networkConfigsArray[i].trim().split(" ");
                if (deviceConfArray[1] === 'eth0') {
                    beginNetworkConfigsBlock = i;
                } else {
                    if (endNetworkConfigsBlock === -1 && beginNetworkConfigsBlock !== -1) {
                        endNetworkConfigsBlock = i - 1;
                        break;
                    }
                }
            }
        }
    }
    //prepare new configs array for insert
    let newConfigsArray = [`iface eth0 inet ${newConfigs['eth0']}`];
    for (var key in newConfigs) {
        if (key !== 'eth0') {
            const commented = newConfigs['eth0'] === 'dhcp' ? '#' : '';
            newConfigsArray = [...newConfigsArray, `  ${commented}${key} ${newConfigs[key]}`];
        }
    }
    // TODO:
    newConfigsArray = [
        ...newConfigsArray,
        "  #don't remove this udhcpc_opts!",
        '  udhcpc_opts -s /etc/network/kill_udhcpc_at_startup',
        '  pre-up /bin/grep -v -e "ip=[0-9]\+\.[0-9]\+\.[0-9]\+\.[0-9]\+" /proc/cmdline $line > /dev/null'
    ];

    //insert newConfigsArray into cconfigs
    const resultConfigsArray = [
        ...networkConfigsArray.slice(0, beginNetworkConfigsBlock),
        ...newConfigsArray,
        '',
        ...networkConfigsArray.slice(endNetworkConfigsBlock + 1)
    ]

    let resultConfigs = '';
    for (var i in resultConfigsArray) {
        const nextStr = (i < resultConfigsArray.length - 1) ? '\n' : '';
        resultConfigs += resultConfigsArray[i] + nextStr;
    }

    fs.writeFileSync(fileAddress, resultConfigs);
    return true;
}
function writeNetworkConfig_r2 (newConfigs, fileAddress)
{
    const strFileConfig = fs.readFileSync(fileAddress, 'utf8').toString();
    let validStrFileConfig = typeof strFileConfig === 'string';
    let validNewConfig = typeof newConfigs === 'object';
    if (!validStrFileConfig || !validNewConfig) return false;
    let oldConfig = parseNetworkConfig_r2(strFileConfig,'full');
    for (let key in oldConfig) 
    {
        let item = oldConfig[key];
        if( newConfigs[key] === undefined ) newConfigs[key] = item;
    }

    let strForSave = 'INTERFACE=eth0\n';
    let comment = newConfigs['eth0'] === 'dhcp' ? '#' : '';
    for (let key in newConfigs) 
    {
        let val = newConfigs[key];
        let upKey = key.toUpperCase();
        if ( key == 'eth0' && val == 'dhcp' ) strForSave+=`DHCP=yes\n`;
        else if ( key == 'eth0' && val == 'static' ) strForSave+=``;
        else if ( key == 'eth0' ) strForSave+=``;
        else if ( key == 'address' ) strForSave+=`${comment}IPADDRESS=${val}\n`;
        else if ( key == 'netmask' ) strForSave+=`${comment}NETMASK=${val}\n`;
        else if ( key == 'gateway' ) strForSave+=`${comment}GATEWAY=${val}\n`;
        else strForSave+=`${upKey}=${val}\n`;
    }
    fs.writeFileSync(fileAddress, strForSave);
    return true;
}

const writeConfig = ({ SETTINGS, PROD_INFO, data: configs, logger }) => {
    logger.silly('writeConfig');
    const fileAddress = SETTINGS.networkConfigs.fileDir + SETTINGS.networkConfigs.fileName;
    
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

    const dnsFileAddress = dnsFileDir + SETTINGS.networkConfigs.DnsFileName;
    
    const newConfigsMask = {
        eth0: null,
        address: null,
        netmask: null,
        gateway: null
    };
    const dnsConfigsMask = {
        domain: null,
        nameserver0: null,
        nameserver1: null
    };

    const newConfigs = parseObjectByMask(configs, newConfigsMask, false);
    const dnsConfigs = parseObjectByMask(configs, dnsConfigsMask, false);

    logger.silly(newConfigs);
    const isMainValid = networkConfValidator({ data: newConfigs, logger });
    logger.silly(dnsConfigs);
    const isDnsValid = networkConfValidator({ data: dnsConfigs, logger });
    const isValid = (isMainValid.isValid && isDnsValid.isValid);

    logger.info('Is valid new configs for write to "interfaces" = ' + (isValid));
    // merge configs and write to file
    if (isValid) {
        /**
         * Write main configs
         */
        
        //const networkConfigsArray = fs.readFileSync(fileAddress, 'utf8').toString().split("\n");
        if ( softwareRevision == 2 )  writeNetworkConfig_r2 (newConfigs, fileAddress);
        else writeNetworkConfig_r1(newConfigs, fileAddress);

        /**
         * Write DNS configs
         */
        const hasDomain = dnsConfigs.domain ? String(dnsConfigs.domain).length > 0 : false;
        const hasNameserver0 = dnsConfigs.nameserver0 ? String(dnsConfigs.nameserver0).length > 0 : false;
        const hasNameserver1 = dnsConfigs.nameserver1 ? String(dnsConfigs.nameserver1).length > 0 : false;
        
        let rowDomain = '';
        if(softwareRevision === 1)
        {
            rowDomain = hasDomain ? `domain ${dnsConfigs.domain}\n` : '';
        }
        else if ( softwareRevision >= 2 )
        {
            rowDomain = hasDomain ? `search ${dnsConfigs.domain}\n` : '';
        }
        let dnsConfString = rowDomain;
        dnsConfString += hasNameserver0 ? `nameserver ${dnsConfigs.nameserver0}\n` : '';
        dnsConfString += hasNameserver1 > 0 ? `nameserver ${dnsConfigs.nameserver1}\n` : '';

        fs.writeFileSync(dnsFileAddress, dnsConfString);
    }

    return { isValid: isValid, msg: [...isMainValid.msg, ...isDnsValid.msg] };
}

exports.writeConfig = writeConfig;
