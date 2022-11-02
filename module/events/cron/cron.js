const fs = require("fs")
const path = require("path")
const commands = require("../../jsons/commands.json")
const config = require("../../jsons/config.json")
const { getUrl } = require("../../functions/opCommand.js")
exports.cronEvents = async (client) => {
    const url = commands["uptime"].slice(6)
    const result = await getUrl(url)
    if (result === "オフライン" && config.nowStream === true) {
        client.user.setActivity(`ありけん : オフライン`, {type: "PLAYING"})
        config.nowStream = false
        const writeData = JSON.stringify(config, null, "\t")
        fs.writeFileSync(path.resolve(__dirname, "../../jsons/config.json"), writeData, (err) => { console.log(err) })
    } else {
        if (result !== "オフライン" && config.nowStream === false) {
            client.user.setActivity(`ありけん : 配信中`, { type: "STREAMING", url: "https://www.twitch.tv/arikendebu" })
            config.nowStream = true
            const writeData = JSON.stringify(config, null, "\t")
            fs.writeFileSync(path.resolve(__dirname, "../../jsons/config.json"), writeData, (err) => { console.log(err) })
        }
    }

}