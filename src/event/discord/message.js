/**
 *
 * @param {import("../../class/DiscordMessage").DiscordMessage} messageClient
 */
exports.discordMessageHandler = async (messageClient) => {
    if (!messageClient.isCommand()) return;

    if (messageClient.isManageCommand()) {
        /* manage command */
        const result = messageClient.searchManageArgs();

        if (result.manageArgs === `add`) {
            /* add */
            const addResult = await messageClient.addCommand(result.firstArg, result.secondArg);
            messageClient.reply(addResult);
        };
        if (result.manageArgs === `edit`) {
            /* edit */
            const editResult = await messageClient.editCommand(result.firstArg, result.secondArg);
            messageClient.reply(editResult);
        };
        if (result.manageArgs === `remove`) {
            /* remove */
            const removeResult = await messageClient.removeCommand(result.firstArg);
            messageClient.reply(removeResult);
        };
        if (result.manageArgs === `checkCoolTime`) {
            const checkedResult = messageClient.checkCurrentCoolTime();
            messageClient.reply(checkedResult);
        };
        if (result.manageArgs === `setCoolTime`) {
            const setedCoolTimeResult = messageClient.setCoolTime(result.firstArg);
            messageClient.reply(setedCoolTimeResult);
        };
    } else {
        /* normal command */
        const result = messageClient.searchCommandValueArgs();
        if (result.value === undefined) return;
        if (result.isModCommand) {
            if (!messageClient.isAuthorMod()) return;
            if (result.args === `alias`) {
                const aliasedResult = messageClient.alias(result.value);
                messageClient.reply(aliasedResult);
            } else if (result.args === `fetch`) {
                const fetchedResult = await messageClient.fetch(result.value);
                messageClient.reply(fetchedResult);
            } else {
                messageClient.reply(result.value);
            }
        } else {
            if (result.args === `alias`) {
                const aliasedResult = messageClient.alias(result.value);
                messageClient.reply(aliasedResult);
            } else if (result.args === `fetch`) {
                const fetchedResult = await messageClient.fetch(result.value);
                messageClient.reply(fetchedResult);
            } else {
                messageClient.reply(result.value);
            }
        }
    };
};
