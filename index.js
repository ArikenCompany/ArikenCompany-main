//modules
const tmi = require("tmi.js")
const { Client, Intents } = require("discord.js")
const config = require("./module/jsons/config.json")
const cron = require("node-cron")

//clients
const twitch = new tmi.Client(
    {
        connection: {
            secure: true,
            reconnect: true
        },
        identity: {
            username: config.twitchAuthorName,
            password: config.twitchToken
        },
        channels: config.connectionChannel
    }
)

twitch.connect();

const options = {
    intents: Object.values(Intents.FLAGS),
    partials: ["MESSAGE", "REACTION", "CHANNEL"]
};
const discord = new Client(options)

discord.login(config.discordToken)

//events
const { discordEvents } = require("./module/events/discord/index.js")
const { twitchEvents } = require("./module/events/twitch/index.js")
const { cronEvents } = require("./module/events/cron/cron.js")

discordEvents(discord)
twitchEvents(twitch, discord)
cron.schedule("* * * * *", async () => {
    cronEvents(discord)
})