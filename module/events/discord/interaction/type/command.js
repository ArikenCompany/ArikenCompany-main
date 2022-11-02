const { MessageButton, MessageActionRow } = require("discord.js")
exports.discordInteractionCommand = (interaction) => {
    if (interaction.commandName === "setup") {
        const presetButtonsMemberSolo = new MessageButton()
            .setCustomId("presetButtonsMemberSolo")
            .setStyle("PRIMARY")
            .setLabel("ソロ")
        const presetButtonsNowValo = new MessageButton()
            .setCustomId("presetButtonsNowValo")
            .setStyle("PRIMARY")
            .setLabel("VALORANT")
        const presetButtonsNowSumabura = new MessageButton()
            .setCustomId("presetButtonsNowSumabura")
            .setStyle("PRIMARY")
            .setLabel("スマブラ")
        const presetButtonsNowSpla = new MessageButton()
            .setCustomId("presetButtonsNowSpla")
            .setStyle("PRIMARY")
            .setLabel("スプラ")
        const presetButtonsNowApex = new MessageButton()
            .setCustomId("presetButtonsNowApex")
            .setStyle("PRIMARY")
            .setLabel("APEX")
        const presetButtonsNowTalk = new MessageButton()
            .setCustomId("presetButtonsNowTalk")
            .setStyle("PRIMARY")
            .setLabel("雑談")

        const memberActionRow = new MessageActionRow()
            .addComponents(presetButtonsMemberSolo)

        const nowActionRow = new MessageActionRow()
            .addComponents(presetButtonsNowValo)
            .addComponents(presetButtonsNowSumabura)
            .addComponents(presetButtonsNowSpla)
            .addComponents(presetButtonsNowApex)
            .addComponents(presetButtonsNowTalk)
        interaction.channel.send({
            embeds: [
                {
                    title: "!memberプリセット",
                    description: "ボタンを押せばあらかじめ設定された値に変更されるよ"
                }
            ],
            components: [memberActionRow]
        });
        interaction.channel.send(
            {
                embeds: [
                    {
                        title: "!nowプリセット",
                        description: "ボタンを押せばあらかじめ設定された値に変更されるよ"
                    }
                ],
                components: [nowActionRow]
            }
        )
    }
}