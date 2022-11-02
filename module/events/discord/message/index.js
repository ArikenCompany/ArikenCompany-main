const { discordMessageMod } = require("./type/mod.js")
const { discordMessageNormal } = require("./type/normal.js")
const IDs = require("../../../jsons/ids.json")

exports.discordMessage = (message, client) => {

    if (!message.content.startsWith("!") && !message.content.startsWith("！")) return;
    if (message.author.bot) return
    const cmdArr = message.content.split(/\s+/)
    const cmd = cmdArr[0].substring(1)

    if (message.member.roles.cache.has(IDs.roleId.mod)) {
        discordMessageMod(client, message, cmdArr)
    }
    discordMessageNormal(message, cmd)

}