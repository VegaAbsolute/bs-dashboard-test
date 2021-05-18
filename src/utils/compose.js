const compose = (...funcs) => (Comp) => {
    return funcs.reduce((wrapped, f) => f(wrapped), Comp);
};

exports.compose = compose;
