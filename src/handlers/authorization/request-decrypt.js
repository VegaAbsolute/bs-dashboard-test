
const requestDecrypt = (data) => {
    const { login, password } = JSON.parse(data);
    return { login, password }
}

exports.requestDecrypt = requestDecrypt;
