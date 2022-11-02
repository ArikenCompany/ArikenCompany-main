const IDs = require("../../../../jsons/ids.json")
const { Modal, TextInputComponent, MessageActionRow } = require("discord.js")
const { presetMemberSolo, presetNowApex, presetNowSpla, presetNowSumabura, presetNowTalk, presetNowValo } = require("../../../../functions/manageCommand.js")
const { replyDiscordForInteraction, syncCommandPannel } = require("../../../../functions/opDIscord.js")

exports.discordInteractionButton = async (client, interaction) => {
    if (interaction.customId === "addComButton" && interaction.member.roles.cache.has(IDs.roleId.mod)) {
        const modal = new Modal()
            .setCustomId("addComModal")
            .setTitle("コマンドを追加する")
        const targetCmdBox = new TextInputComponent()
            .setCustomId("targetCmdBox")
            .setLabel("追加するコマンド名")
            .setStyle("SHORT")
        const valueBox = new TextInputComponent()
            .setCustomId("valueBox")
            .setLabel("コマンドの内容")
            .setStyle("PARAGRAPH")
        const firstActionRow = new MessageActionRow().addComponents(targetCmdBox)
        const secondActionRow = new MessageActionRow().addComponents(valueBox)
        modal.addComponents(firstActionRow, secondActionRow)
        await interaction.showModal(modal)
    }
    if (interaction.customId === "editComButton" && interaction.member.roles.cache.has(IDs.roleId.mod)) {
        const modal = new Modal()
            .setCustomId("editComModal")
            .setTitle("コマンドを編集する")
        const targetCmdBox = new TextInputComponent()
            .setCustomId("targetCmdBox")
            .setLabel("編集するコマンド名")
            .setStyle("SHORT")
        const valueBox = new TextInputComponent()
            .setCustomId("valueBox")
            .setLabel("コマンドの内容")
            .setStyle("PARAGRAPH")
        const firstActionRow = new MessageActionRow().addComponents(targetCmdBox)
        const secondActionRow = new MessageActionRow().addComponents(valueBox)
        modal.addComponents(firstActionRow, secondActionRow)
        await interaction.showModal(modal)
    }
    if (interaction.customId === "removeComButton" && interaction.member.roles.cache.has(IDs.roleId.mod)) {
        const modal = new Modal()
            .setCustomId("removeComModal")
            .setTitle("コマンドを削除する")
        const targetCmdBox = new TextInputComponent()
            .setCustomId("targetCmdBox")
            .setLabel("削除するコマンド名")
            .setStyle("SHORT")
        const firstActionRow = new MessageActionRow().addComponents(targetCmdBox)
        modal.addComponents(firstActionRow)
        await interaction.showModal(modal)
    }
    if (interaction.customId === "presetButtonsMemberSolo" && interaction.member.roles.cache.has(IDs.roleId.mod)) {
        const result = presetMemberSolo()
        replyDiscordForInteraction(interaction, result)
        syncCommandPannel(client)
    }
    if (interaction.customId === "presetButtonsNowValo" && interaction.member.roles.cache.has(IDs.roleId.mod)) {
        const result = presetNowValo()
        replyDiscordForInteraction(interaction, result)
        syncCommandPannel(client)
    }
    if (interaction.customId === "presetButtonsNowSumabura" && interaction.member.roles.cache.has(IDs.roleId.mod)) {
        const result = presetNowSumabura()
        replyDiscordForInteraction(interaction, result)
        syncCommandPannel(client)
    }
    if (interaction.customId === "presetButtonsNowSpla" && interaction.member.roles.cache.has(IDs.roleId.mod)) {
        const result = presetNowSpla()
        replyDiscordForInteraction(interaction, result)
        syncCommandPannel(client)
    }
    if (interaction.customId === "presetButtonsNowApex" && interaction.member.roles.cache.has(IDs.roleId.mod)) {
        const result = presetNowApex()
        replyDiscordForInteraction(interaction, result)
        syncCommandPannel(client)
    }
    if (interaction.customId === "presetButtonsNowTalk" && interaction.member.roles.cache.has(IDs.roleId.mod)) {
        const result = presetNowTalk()
        replyDiscordForInteraction(interaction, result)
        syncCommandPannel(client)
    }
}