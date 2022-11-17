/**
 * @param {import("../../class/DiscordButton").DiscordButton} interactionClient
 */
module.exports.discordButtonHandler = async (interactionClient) => {
    const buttonType = interactionClient.buttonType();
    if (buttonType.type === `pages`) {
        // switching page operation
        switch (buttonType.operation) {
            case `back`:
                interactionClient.backPage(buttonType.message);
                break;
            case `next`:
                interactionClient.nextPage(buttonType.message);
                break;
            default:
                break;
        }
    } else if (buttonType.type === `template` && buttonType.operation === `set`) {
        const result = await interactionClient.setCommandByTemplate(interactionClient.interaction.client);
        if (result.isSuccess) { interactionClient.reply(`${result.command} を ${result.value} に変更`); }
        if (!result.isSuccess) { interactionClient.reply(result.message); }
    } else {
        /** @type {import("../../data/Type").ShowModalOptions} */
        const showModalOptions = {
            type: buttonType.type,
            operation: buttonType.operation
        };
        interactionClient.showModal(showModalOptions);
    }
};
