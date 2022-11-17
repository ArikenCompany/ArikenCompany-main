const path = require(`path`);
const { readFileSync } = require(`fs`);
/**
 * Twitchでのコメント数ランキングを返す
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.responseMessagesRanking = (req, res) => {
    const messageRanking = JSON.parse(readFileSync(path.resolve(__dirname, `../../data/MessageCounter.json`), { encoding: `utf-8` }));
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    res.json(messageRanking);
};
