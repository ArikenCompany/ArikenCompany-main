exports.syncCommandPannel = async (client) => {
    const IDs = require("../jsons/ids.json")
    const commands = require("../jsons/commands.json")

    const channel = client.channels.cache.get(IDs.channelId.manageCmd)
    const msg = await channel.messages.fetch(IDs.massageId.manageCmd)

    const newCommands = JSON.parse(JSON.stringify(commands))
    newCommands["rank"] = "rank"
    newCommands["uptime"] = "uptime"
    newCommands["wins"] = "win percent"
    const dataLength = Object.keys(newCommands).length;
    const arr = [];
    for (let i = 0; i < dataLength; i++) arr.push("**!" + Object.keys(newCommands)[i] + "** " + Object.values(newCommands)[i]);
    const result = arr.join('\n');

    const msgEmbed = msg.embeds[0]
    msgEmbed.fields[0].value = result
    msg.edit({ embeds: [msgEmbed] })
    return
}

exports.replyDiscordForInteraction = (interaction, replyContent) => {
    interaction.reply(
        {
            content: replyContent,
            ephemeral: true
        }
    )
}

exports.replyDiscordForMessage = (message, replyContent) => {
    message.reply(replyContent)
}