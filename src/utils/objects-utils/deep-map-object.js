function mapObject(obj, deepMapper) {
    return Object.keys(obj).reduce(
        (res, key) => {
            res[key] = deepMapper(key, obj[key]);
            return res;
        },
        {}
    )
}


/**
 * Deep map object. Returns object of results of injected function, the object has structure like entered object structure.
 *  @param {Object} initial object
 *  @param {function}
 *  Function @params:
 *  @param {String} name current field
 *  @param {} current field value
 *  @param {String} full path to current field
 *
 *  @return {} value for set into new object
 */

function deepMap(obj, fn, path='Object') {
    const deepMapper = (key, val) => {
        return (typeof val === 'object') ? deepMap(val, fn, path+'.'+key) : fn(key, val, path+'.'+key);
    }

    if (Array.isArray(obj)) {
        return obj.map(deepMapper);
    }
    if (typeof obj === 'object') {
        return mapObject(obj, deepMapper);
    }
    return obj;
}

exports.deepMap = deepMap;
