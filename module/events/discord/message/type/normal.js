const commands = require("../../../../jsons/commands.json")
const { replyDiscordForMessage } = require("../../../../functions/opDIscord.js")
const { getUrl } = require("../../../../functions/opCommand.js")
const { commandLogForDiscord } = require("../../../../functions/logging.js")

exports.discordMessageNormal = async (message, cmd) => {
    if (commands[cmd] !== undefined) {
        if (commands[cmd].startsWith("fetch")) {
            const url = commands[cmd].slice(6)
            const result = await getUrl(url)
            replyDiscordForMessage(message, result)
            commandLogForDiscord(cmd, message.author)
        } else {
            const result = commands[cmd]
            replyDiscordForMessage(message, result)
            commandLogForDiscord(cmd, message.author)
        }
    }
}