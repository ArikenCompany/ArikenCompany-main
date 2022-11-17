const { Manage } = require(`./Manage`);
const { MessageActionRow, MessageButton } = require(`discord.js`);
const { randomUUID } = require(`crypto`);

/**
 * ModalSubmitInteractionのクラス
 * @class
 * @extends Manage
 * @extends Command
 */
class DiscordModal extends Manage {
    /**
     * @param {import("discord.js").ModalSubmitInteraction} interaction
     */
    constructor (interaction) {
        super();
        this.interaction = interaction;
        // interactionのmodalがtargetCommandInputを含まなかった時の場合。現在はない
        try {
            this.command = interaction.fields.getTextInputValue(`targetCommandInput`);
        } catch {
            this.command = undefined;
        }
        // interactionのmodalがvalueInputを含まなかった時の場合。removeModalの場合
        try {
            this.value = interaction.fields.getTextInputValue(`valueInput`);
        } catch {
            this.value = undefined;
        }
    }

    /**
     * Modalの種類を判別
     * @returns {{ type: "command" | "template", operation: "add" | "edit" | "remove"}}
     */
    searchModalType () {
        if (this.interaction.customId === `addCommandModal` || this.interaction.customId === `editCommandModal` || this.interaction.customId === `removeCommandModal`) {
            /* manage command modal */
            if (this.interaction.customId === `addCommandModal`) {
                return { type: `command`, operation: `add` };
            }
            if (this.interaction.customId === `editCommandModal`) {
                return { type: `command`, operation: `edit` };
            }
            if (this.interaction.customId === `removeCommandModal`) {
                return { type: `command`, operation: `remove` };
            }
        }
        if (this.interaction.customId === `addTemplateModal`) {
            if (this.interaction.customId === `addTemplateModal`) {
                return { type: `template`, operation: `add` };
            }
        }
    }

    /**
     * コマンドの内容に構文エラーがないか判別
     * @returns {{isValid: boolean, message: string | undefined}}
     */
    isValidValue () {
        if (!this.command.startsWith(`!`)) return { isValid: false, message: `SyntaxError: 無効なコマンド名です` };
        const result = super.isValidArgs(this.value);
        if (result.isValid === false) {
            return { isValid: false, message: result.message };
        } else {
            return { isValid: true };
        }
    }

    /**
     * コマンドを追加
     * @async
     * @returns {{isSuccess: boolean, data: {command: string, value: string} | undefined, error: string | undefined}}
     */
    async addCommand () {
        const result = super.add(this.command, this.value);
        super.createCommandPagesPrivate();
        super.createCommandPagesPublic();
        await super.syncCommandPanel(this.interaction.client);
        if (result === true) {
            return { isSuccess: true, data: { command: this.command, value: this.value } };
        } else {
            return { isSuccess: false, error: `SyntaxError: 存在するコマンド名です` };
        }
    }

    /**
     * コマンドを編集
     * @async
     * @returns {{isSuccess: boolean, data: {command: string, value: string} | undefined, error: string | undefined}}
     */
    async editCommand () {
        const result = super.edit(this.command, this.value);
        super.createCommandPagesPrivate();
        super.createCommandPagesPublic();
        await super.syncCommandPanel(this.interaction.client);
        if (result === true) {
            return { isSuccess: true, data: { command: this.command, value: this.value } };
        } else {
            return { isSuccess: false, error: `SyntaxError: 存在しないコマンド名です` };
        }
    }

    /**
     * コマンドを削除
     * @async
     * @returns {{isSuccess: boolean, data: {command: string, value: string} | undefined, error: string | undefined}}
     */
    async removeCommand () {
        const result = super.remove(this.command);
        super.createCommandPagesPrivate();
        super.createCommandPagesPublic();
        await super.syncCommandPanel(this.interaction.client);
        if (result === true) {
            return { isSuccess: true, data: { command: this.command, value: this.value } };
        } else {
            return { isSuccess: false, error: `SyntaxError: 存在しないコマンド名です` };
        }
    }

    /**
     * テンプレートボタンを追加
     * @returns {{isSuccess: boolean, message: string | undefined}}
     */
    addTemplate () {
        const BUTTON_LABEL_MAX_LENGTH = 80;
        if (BUTTON_LABEL_MAX_LENGTH < this.value.length) return { isSuccess: false, message: `TypeError: テンプレートに追加する内容は80文字未満である必要があります` };
        const result = super.isValidArgs(this.value);
        if (!result.isValid) return { isSuccess: false, message: result.message };
        const components = this.interaction.message.components;
        const newButton = new MessageButton()
            .setCustomId(`template` + randomUUID())
            .setLabel(this.value)
            .setStyle(`PRIMARY`);
        const messageActionRowLength = components.length;
        const lastRowLength = components[components.length - 1].components.length;
        /* ボタンが１メッセージに5行5個づつでマックスの時 */
        if (messageActionRowLength === 5 && lastRowLength === 5) return { isSuccess: false, message: `Error: これ以上このコマンドのテンプレートを追加できません` };
        if (lastRowLength === 5) {
            /* 列に5つになっていて別の列を追加 */
            const newMessageActionRow = new MessageActionRow().addComponents(newButton);
            components.push(newMessageActionRow);
            this.interaction.message.edit({ components });
            return { isSuccess: true };
        } else {
            /* 単純に追加 */
            components[messageActionRowLength - 1].addComponents(newButton);
            this.interaction.message.edit({ components });
            return { isSuccess: true };
        }
    }

    /**
     * ModalSubmitInteraction.reply()
     * @param {string} content
     * @param {boolean} [isEphemeral = true]
     */
    reply (content, isEphemeral = true) {
        this.interaction.reply({ content, ephemeral: isEphemeral });
    }
};

module.exports = { DiscordModal };
