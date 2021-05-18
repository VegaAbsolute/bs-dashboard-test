/**
* Performs a deep merge of objects and returns new object. Does not modify
* objects (immutable) and merges arrays via concatenation.
*
* @param {...object} objects - Objects to merge
* @returns {object} New object with merged key/values
*/

const mergeDeep = (...objects) => {
  const isObject = (obj) => {
	  return obj && typeof obj === 'object';
  }

  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach((key) => {
      const prevVal = prev[key];
      const objVal = obj[key];
      if (Array.isArray(prevVal) && Array.isArray(objVal)) {
        prev[key] = prevVal.concat(...objVal);
      }
      else if (isObject(prevVal) && isObject(objVal)) {
        prev[key] = mergeDeep(prevVal, objVal);
      }
      else {
        prev[key] = objVal;
      }
    });

    return prev;
  }, {});
}

exports.mergeDeep = mergeDeep;
