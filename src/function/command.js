/**
 * メッセージ内容から管理コマンドか判定
 * @param {string} content
 * @return {boolean}
 */
exports.isManageCommand = (content) => {
    const arr = [`!addcom`, `!editcom`, `!rmcom`, `!removecom`, `!cooltime`, `!setcooltime`, `!setct`, `!ct`, `!allow`, `!deny`];
    const cmdArr = content.split(` `);
    if (arr.includes(cmdArr[0])) {
        return true;
    } else {
        return false;
    }
};
