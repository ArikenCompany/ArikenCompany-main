const { addCommand, editCommand, removeCommand, addBlackList, removeBlackList, onCommand, offCommand } = require("../../functions/manageCommand.js")
exports.socketEvents = (socket) => {
    socket.on("addCommand", (commandName, value) => {
        addCommand(commandName, value)
    })

    socket.on("editCommand", (commandName, value) => {
        editCommand(commandName, value)
    })

    socket.on("removeCommand", (commandName) => {
        removeCommand(commandName)
    })

    socket.on("addBlackList", (userName) => {
        addBlackList(userName)
    })

    socket.on("removeBlackList", (userName) => {
        removeBlackList(userName)
    })

    socket.on("onCommand", () => {
        onCommand()
    })

    socket.on("offCommand", () => {
        offCommand()
    })
}