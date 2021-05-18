const checkBoolObjectForFalse = (obj) => {
    let result = true;
    const deepObj = (object) => {
        for(var prop in object) {
            if (typeof object[prop] === 'object') {
                deepObj(object[prop]);
            } else {
                if (!object[prop]) {
                    result = false;
                    break;
                }
            }
        }
        return result;
    }
     return deepObj(obj);
}

exports.checkBoolObjectForFalse = checkBoolObjectForFalse;
