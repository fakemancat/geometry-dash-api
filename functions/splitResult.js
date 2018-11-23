module.exports = (res, spliter = ':') => {
    res = res.split('#')[0].split(spliter);
    let result = {};

    for (let i = 0; i < res.length; i += 2) {
        result[res[i]] = res[i + 1];
    }

    return result;
};
