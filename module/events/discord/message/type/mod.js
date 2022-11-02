const { onCommand, offCommand, addCommand, editCommand, removeCommand, returnCurrentCooltime, setCoolTime, addBlackList, removeBlackList } = require("../../../../functions/manageCommand.js")
const { syncCommandPannel, replyDiscordForMessage } = require("../../../../functions/opDIscord.js")


exports.discordMessageMod = async (client, message, cmdArr) => {
    const secondCmd = cmdArr[1]
        if (secondCmd === "on") {
            onCommand()
            replyDiscordForMessage(message, `<@${message.author.id}> → コマンドの使用をONに変更`)
        }

        if (secondCmd === "off") {
            offCommand()
            replyDiscordForMessage(message, `<@${message.author.id}> → コマンドの使用をOFFに変更`)
        }

        if (secondCmd === "add") {
            const target = cmdArr[2]
            cmdArr.splice(0, 3)
            const contentOfCommand = cmdArr.join(" ")
            const result = addCommand(target, contentOfCommand)
            replyDiscordForMessage(message, `<@${message.author.id}> → ${result}`)
            await syncCommandPannel(client)
        }

        if (secondCmd === "edit") {
            const target = cmdArr[2]
            cmdArr.splice(0, 3)
            const contentOfCommand = cmdArr.join(" ")
            const result = editCommand(target, contentOfCommand)
            replyDiscordForMessage(message, `<@${message.author.id}> → ${result}`)
            await syncCommandPannel(client)
        }

        if (secondCmd === "remove") {
            const result = removeCommand(cmdArr[2])
            replyDiscordForMessage(message, `<@${message.author.id}> → ${result}`)
            await syncCommandPannel(client)
        }

        if (secondCmd === "cooltime") {
            const result = returnCurrentCooltime()
            replyDiscordForMessage(message, `<@${message.author.id}> → ${result}`)
        }

        if (secondCmd === "setcooltime") {
            const result = setCoolTime(cmdArr[2])
            replyDiscordForMessage(message, `<@${message.author.id}> → ${result}`)
        }

        if (secondCmd === "addbl" || secondCmd === "addblacklist") {
            const result = addBlackList(cmdArr[2])
            replyDiscordForMessage(message, `<@${message.author.id}> → ${result}`)
        }

        if (secondCmd === "removebl" || secondCmd === "removeblacklist") {
            const result = removeBlackList(cmdArr[2])
            replyDiscordForMessage(message, `<@${message.author.id}> → ${result}`)
        }
}