const commands = require("../../../../jsons/commands.json")
const { replyTwitch } = require("../../../../functions/opTwitch.js")
const { getUrl, controlCooltimes } = require("../../../../functions/opCommand.js")
const { commandLogForTwitch } = require("../../../../functions/logging.js")
exports.twitchMessageNormal = async (client, channel, tags, cmd,) => {
    if (commands[cmd] !== undefined) {
        if (commands[cmd].startsWith("fetch")) {
            const url = commands[cmd].slice(6)
            const result = await getUrl(url)
            replyTwitch(client, channel, result)
            commandLogForTwitch(cmd, tags)
            controlCooltimes(cmd, tags)
        } else {
            if (commands[cmd].startsWith("mod")) {
                if (tags.mod) {
                    const data = commands[cmd].slice(4)
                    replyTwitch(client, channel, data)
                    commandLogForTwitch(cmd, tags)
                }
            }  else {
                const result = commands[cmd]
                replyTwitch(client, channel, result)
                commandLogForTwitch(cmd, tags)
                controlCooltimes(cmd, tags)
            }
        }
    }
}