const { readFileSync } = require(`fs`);
const path = require(`path`);
/**
 * コマンドの一覧を返す
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.responseCommands = (req, res) => {
        /** @type {object}  */
        const pages = JSON.parse(readFileSync(path.resolve(__dirname, `../../data/CommandsPublic.json`), { encoding: `utf-8` }));
        res.setHeader(`Access-Control-Allow-Origin`, `*`);
        res.json(pages);
};
