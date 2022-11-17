/**
 * @param {import("../../class/TwitchMessage").TwitchMessage} messageClient
 */
exports.twitchMessageHandler = async (messageClient) => {
    if (!messageClient.isCommand()) return;
    if (!messageClient.isUsableCommand()) return;

    if (messageClient.isManageCommand()) {
        /* manage command */
        if (!messageClient.isManager()) return;
        const result = messageClient.searchManageArgs();

        if (result.manageArgs === `add`) {
            /* add */
            const addResult = await messageClient.addCommand(result.firstArg, result.secondArg);
            if (addResult.isSucceed) { messageClient.reply(`@${messageClient.user.username} → ${addResult.message}`); }
            if (!addResult.isSucceed) { messageClient.reply(addResult.message); }
        };
        if (result.manageArgs === `edit`) {
            /* edit */
            const editResult = await messageClient.editCommand(result.firstArg, result.secondArg);
            if (editResult.isSucceed) { messageClient.reply(`@${messageClient.user.username} → ${editResult.message}`); }
            if (!editResult.isSucceed) { messageClient.reply(editResult.message); }
        };
        if (result.manageArgs === `remove`) {
            /* remove */
            const removeResult = await messageClient.removeCommand(result.firstArg);
            if (removeResult.isSucceed) { messageClient.reply(`@${messageClient.user.username} → ${removeResult.message}`); }
            if (!removeResult.isSucceed) { messageClient.reply(removeResult.message); }
        };
        if (result.manageArgs === `checkCoolTime`) {
            const checkedResult = messageClient.checkCurrentCoolTime();
            messageClient.reply(`@${messageClient.user.username} → ${checkedResult}`);
        };
        if (result.manageArgs === `setCoolTime`) {
            const setedCoolTimeResult = messageClient.setCoolTime(result.firstArg);
            messageClient.reply(`@${messageClient.user.username} → ${setedCoolTimeResult}`);
        };
    } else {
        /* normal command */
        const result = messageClient.searchCommandValueArgs();
        if (result.value === undefined) return;
        if (result.isModCommand) {
            if (!messageClient.isManager()) return;
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
            messageClient.loggingCoolTime();
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
    }
};
