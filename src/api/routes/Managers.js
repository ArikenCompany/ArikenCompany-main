const { readFileSync } = require(`fs`);
const path = require(`path`);
/**
 * コマンド管理者権限持ちの一覧を返す
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.responseManagers = (req, res) => {
    const result = JSON.parse(readFileSync(path.resolve(__dirname, `../../data/CommandManager.json`), { encoding: `utf-8` }));
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    res.json(result);
};
