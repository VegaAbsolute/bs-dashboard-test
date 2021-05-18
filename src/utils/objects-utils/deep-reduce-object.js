/**
 *
 * @param {Object}
 * @param {} Init value as prevResult for following function.
 * @param {Function} (objectKeyPath, keyName, keyValue, prevResult)
 */

const deepReduceObject = (obj, initValue, fn) => {


    const deepObj = (path, object, prevResult, fn) => {
        let result = prevResult;

        for(let key in object) {
            if (typeof object[key] === 'object' && object[key] !== null) {
                result = deepObj(path+'.'+key, object[key], result, fn);
            } else {
                result = fn(path, key, object[key], result);
            }
        }

        return result;
    }


    return deepObj('Object', obj, initValue, fn);
}

exports.deepReduceObject = deepReduceObject;
