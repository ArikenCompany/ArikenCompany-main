const { MessageButton, Modal, TextInputComponent, MessageActionRow } = require(`discord.js`);

// Buttons
const addCommandButton = new MessageButton()
    .setCustomId(`addCommandButton`)
    .setStyle(`SUCCESS`)
    .setLabel(`add`);

const editCommandButton = new MessageButton()
    .setCustomId(`editCommandButton`)
    .setStyle(`SUCCESS`)
    .setLabel(`edit`);

const removeCommandButton = new MessageButton()
    .setCustomId(`removeCommandButton`)
    .setStyle(`SUCCESS`)
    .setLabel(`remove`);

const addTemplateButton = new MessageButton()
    .setCustomId(`addTemplateButton`)
    .setStyle(`DANGER`)
    .setLabel(`追加`);

const nextButton = new MessageButton()
    .setCustomId(`nextButton`)
    .setStyle(`PRIMARY`)
    .setLabel(`▶️`);

const backButton = new MessageButton()
    .setCustomId(`backButton`)
    .setStyle(`PRIMARY`)
    .setLabel(`◀️`);

// TextInputComponents
const targetCommandInput = new TextInputComponent()
    .setCustomId(`targetCommandInput`)
    .setLabel(`操作するコマンド名(!付き)`)
    .setValue(`!`)
    .setStyle(`SHORT`);
const valueInput = new TextInputComponent()
    .setCustomId(`valueInput`)
    .setLabel(`コマンドの内容`)
    .setStyle(`PARAGRAPH`);

// MessageActionRows
const targetCommandInputActionRow = new MessageActionRow().addComponents(targetCommandInput);
const valueInputActionRow = new MessageActionRow().addComponents(valueInput);

// Modals
const addCommandModal = new Modal()
    .setCustomId(`addCommandModal`)
    .setTitle(`コマンドを追加する`)
    .addComponents(targetCommandInputActionRow, valueInputActionRow);

const editCommandModal = new Modal()
    .setCustomId(`editCommandModal`)
    .setTitle(`コマンドを編集する`)
    .addComponents(targetCommandInputActionRow, valueInputActionRow);

const removeCommandModal = new Modal()
    .setCustomId(`removeCommandModal`)
    .setTitle(`コマンドを削除する`)
    .addComponents(targetCommandInputActionRow);

const addTemplateModal = new Modal()
    .setCustomId(`addTemplateModal`)
    .setTitle(`コマンドの定型文を追加する`)
    .addComponents(valueInputActionRow);
module.exports = { addCommandButton, editCommandButton, removeCommandButton, addTemplateButton, backButton, nextButton, addCommandModal, editCommandModal, removeCommandModal, addTemplateModal };
