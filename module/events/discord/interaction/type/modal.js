const { addCommand, editCommand, removeCommand } = require("../../../../functions/manageCommand.js")
const { syncCommandPannel, replyDiscordForInteraction } = require("../../../../functions/opDIscord.js")

exports.discordInteractionModal = async (client, interaction) => {
    if (interaction.customId === "addComModal") {
        const targetCmd = interaction.fields.getTextInputValue("targetCmdBox")
        const newValue = interaction.fields.getTextInputValue("valueBox")
        const result = addCommand(targetCmd, newValue)
        replyDiscordForInteraction(interaction, result)
        await syncCommandPannel(client)
    }
    if (interaction.customId === "editComModal") {
        const targetCmd = interaction.fields.getTextInputValue("targetCmdBox")
        const newValue = interaction.fields.getTextInputValue("valueBox")
        const result = editCommand(targetCmd, newValue)
        replyDiscordForInteraction(interaction, result)
        await syncCommandPannel(client)
    }
    if (interaction.customId === "removeComModal") {
        const targetCmd = interaction.fields.getTextInputValue("targetCmdBox")
        const result = removeCommand(targetCmd)
        replyDiscordForInteraction(interaction, result)
        await syncCommandPannel(client)
    }
}