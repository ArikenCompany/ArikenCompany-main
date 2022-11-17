/**
 * @param {import("../../class/DiscordCommand").DiscordCommand} interactionClient
 */
module.exports.discordCommandHandler = async (interactionClient) => {
    const Arg = interactionClient.searchCommand();
    if (Arg.arg === `panel`) {
        await interactionClient.createPanel();
    };
    if (Arg.arg === `template`) {
        const error = interactionClient.createTemplate(Arg.value);
        if (error !== undefined) {
            interactionClient.reply(error, true);
        }
    }
};
