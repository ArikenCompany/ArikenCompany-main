const { TwitchMessage, DiscordMessage, DiscordCommand, DiscordButton, DiscordModal } = require(`../class/index`);
const { twitchReadyHandler, twitchMessageHandler } = require(`./twitch/index`);
const { discordReadyHandler, discordMessageHandler, discordCommandHandler, discordButtonHandler, discordModalHandler } = require(`./discord/index`);
const { discordModRole } = require(`../config/settings.json`);

/**
 * @param {import("discord.js").Client} discordClient
 * @param {import("tmi.js").Client} twitchClient
 */
exports.eventHandler = async (discordClient, twitchClient) => {
    discordClient.login(process.env.DISCORD_TOKEN);
    twitchClient.connect();

    twitchClient.on(`connected`, () => {
        twitchReadyHandler();
    });

    twitchClient.on(`message`, async (channel, user, message, self) => {
        const messageClient = new TwitchMessage(twitchClient, discordClient, { channel, user, message, self });
        await twitchMessageHandler(messageClient);
    });

    discordClient.on(`ready`, async () => {
        await discordReadyHandler(discordClient);
    });

    discordClient.on(`messageCreate`, async (message) => {
        const messageClient = new DiscordMessage(message);
        await discordMessageHandler(messageClient);
    });

    discordClient.on(`interactionCreate`, async (interaction) => {
        if (!interaction.member.roles.cache.has(discordModRole)) return;
        if (interaction.isCommand()) {
            /* slash command */
            const interactionClient = new DiscordCommand(interaction);
            await discordCommandHandler(interactionClient);
        }
        if (interaction.isButton()) {
            /* button */
            const interactionClient = new DiscordButton(interaction);
            discordButtonHandler(interactionClient);
        }
        if (interaction.isModalSubmit()) {
            /* modal */
            const interactionClient = new DiscordModal(interaction);
            discordModalHandler(interactionClient);
        }
    });
};
