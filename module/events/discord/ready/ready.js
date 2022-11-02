const { syncCommandPannel } = require("../../../functions/opDIscord.js")
const slashCommand = require("../../../jsons/slashCommand.json")
exports.discordReady = (client) => {
    client.application.commands.set(slashCommand.commands, "996289385765032017")
    const { readyLogForDiscord } = require("../../../functions/logging")
    readyLogForDiscord()
    syncCommandPannel(client)
}