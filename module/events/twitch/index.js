const { twitchReady } = require("./ready/ready.js")
const { twitchMessage } = require("./message/message.js")
exports.twitchEvents = (client, discord) => {
    client.on("connected", () => {
        twitchReady()
    })
    client.on("message", async (channel, tags, message, self) => {
        twitchMessage(client, discord, channel, tags, message)
    })
}