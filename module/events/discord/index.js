exports.discordEvents = (client) => {
    const { discordReady } = require("./ready/ready.js")
    const { discordInteraction } = require("./interaction/index.js")
    const { discordMessage } = require("./message/index.js")
    client.on("ready", () => {
        discordReady(client)
    })
    client.on("interactionCreate", async (interaction) => {
       discordInteraction(client, interaction)
    })
    client.on("messageCreate", async (message) => {
        discordMessage(message, client)
    })
}