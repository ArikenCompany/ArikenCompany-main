const { discordInteractionModal } = require("./type/modal.js")
const { discordInteractionButton } = require("./type/button.js")
const { discordInteractionCommand } = require("./type/command.js")

exports.discordInteraction = (client, interaction) => {
    if (interaction.isCommand()) {
        //slash commands
        discordInteractionCommand(interaction)
    }

    if (interaction.isButton()) {
        //button 
        discordInteractionButton(client, interaction)
    }

    if (interaction.isModalSubmit()) {
        //modal submit
        discordInteractionModal(client, interaction)
    }
}