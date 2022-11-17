/**
 * @param {import("../../class/DiscordModal").DiscordModal} interactionClient
 */
module.exports.discordModalHandler = async (interactionClient) => {
    if (!interactionClient.value) {
        const removeResult = await interactionClient.removeCommand();
        if (removeResult.isSuccess) {
            interactionClient.reply(`${removeResult.data.command} を削除`);
        } else {
            interactionClient.reply(removeResult.error);
        }
    } else {
        const modalType = interactionClient.searchModalType();
        if (modalType.type === `command`) {
            const isValidResult = interactionClient.isValidValue();
            if (isValidResult.isValid === false) return interactionClient.reply(isValidResult.message);
            if (modalType.operation === `add`) {
                const addResult = await interactionClient.addCommand();
                if (addResult.isSuccess) {
                    interactionClient.reply(`${addResult.data.command} を追加`);
                } else {
                    interactionClient.reply(addResult.error);
                }
            }
            if (modalType.operation === `edit`) {
                const editResult = await interactionClient.editCommand();
                if (editResult.isSuccess) {
                    interactionClient.reply(`${editResult.data.command} を ${editResult.data.value} に変更`);
                } else {
                    interactionClient.reply(editResult.error);
                }
            }
        }
        if (modalType.type === `template`) {
            if (modalType.operation === `add`) {
                const addResult = interactionClient.addTemplate();
                if (addResult.isSuccess) return interactionClient.reply(`テンプレートを追加`);
                interactionClient.reply(addResult.message);
            }
        }
    }
};
