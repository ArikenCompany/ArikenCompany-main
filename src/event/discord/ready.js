const { commands } = require(`../../data/SlashCommands`);
const { discordGuild } = require(`../../config/settings.json`);
/**
 * @param {import("discord.js").Client} client
 */
module.exports.discordReadyHandler = async (client) => {
    console.log(`discord client is ready!`);
    await client.application.commands.set(commands, discordGuild);
    return;
};
