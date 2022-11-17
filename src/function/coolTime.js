exports.checkCurrentCoolTime = () => {
    const { coolTime } = require(`../config/settings.json`);
    return `${coolTime}秒`;
};
