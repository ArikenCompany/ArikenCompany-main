const { onCommand, offCommand, addCommand, editCommand, removeCommand, returnCurrentCooltime, setCoolTime, addBlackList, removeBlackList } = require("../../../../functions/manageCommand.js")
const { syncCommandPannel } = require("../../../../functions/opDIscord.js")
const { replyTwitch } = require("../../../../functions/opTwitch.js")
exports.twitchMessageMod = async (client, discord, channel, tags, cmdArr) => {
    const secondCmd = cmdArr[1]
        if (secondCmd === "on") {
            onCommand()
            replyTwitch(client, channel, `@${tags.username} → コマンドの使用をONに変更`)
        }

        if (secondCmd === "off") {
            offCommand()
            replyTwitch(client, channel, `@${tags.username} → コマンドの使用をOFFに変更`)
        }

        if (secondCmd === "add") {
            const target = cmdArr[2]
            cmdArr.splice(0, 3)
            const contentOfCommand = cmdArr.join(" ")
            const result = addCommand(target, contentOfCommand)
            replyTwitch(client, channel, `@${tags.username} → ${result}`)
            await syncCommandPannel(discord)
        }

        if (secondCmd === "edit") {
            const target = cmdArr[2]
            cmdArr.splice(0, 3)
            const contentOfCommand = cmdArr.join(" ")
            const result = editCommand(target, contentOfCommand)
            replyTwitch(client, channel, `@${tags.username} → ${result}`)
            await syncCommandPannel(discord)
        }

        if (secondCmd === "remove") {
            const result = removeCommand(cmdArr[2])
            replyTwitch(client, channel, `@${tags.username} → ${result}`)
            await syncCommandPannel(discord)
        }

        if (secondCmd === "cooltime") {
            const result = returnCurrentCooltime()
            replyTwitch(client, channel, `@${tags.username} → ${result}`)
        }

        if (secondCmd === "setcooltime") {
            const result = setCoolTime(cmdArr[2])
            replyTwitch(client, channel, `@${tags.username} → ${result}`)
        }

        if (secondCmd === "addbl" || secondCmd === "addblacklist") {
            const result = addBlackList(cmdArr[2])
            replyTwitch(client, channel, `@${tags.username} → ${result}`)
        }
        
        if (secondCmd === "removebl" || secondCmd === "removeblacklist") {
            const result = removeBlackList(cmdArr[2])
            replyTwitch(client, channel, `@${tags.username} → ${result}`)
        }
}