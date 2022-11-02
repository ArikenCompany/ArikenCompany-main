const { twtchNormalCommandPermission, twtchAdminCommandPermission, twitchCommandIsAdmin } = require("../../../functions/commandPermission.js")
const { twitchMessageMod } = require("./type/mod.js")
const { twitchMessageNormal } = require("./type/normal.js")

exports.twitchMessage = async (client, discord, channel, tags, message) => {
    if (!message.startsWith("!") && !message.startsWith("！")) return;
    const cmdArr = message.split(/\s+/)
    const cmd = cmdArr[0].substring(1)
    if (twitchCommandIsAdmin(cmd) && twtchAdminCommandPermission(tags)) {
        twitchMessageMod(client, discord, channel, tags, cmdArr)
    }

    if (!twitchCommandIsAdmin(cmd) && twtchNormalCommandPermission(tags, cmd)) {
        twitchMessageNormal(client, channel, tags, cmd)
    }
}