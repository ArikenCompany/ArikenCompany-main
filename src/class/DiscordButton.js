const { Manage } = require(`./Manage`);
const { addCommandModal, editCommandModal, removeCommandModal, addTemplateModal } = require(`../data/Components`);
const { readFileSync } = require(`fs`);
const path = require(`path`);

/**
 * ButtonInteractionのクラス
 * @class
 * @extends Manage
 * @extends Command
 */
class DiscordButton extends Manage {
    /**
     * @param {import("discord.js").ButtonInteraction} interaction
     */
    constructor (interaction) {
        super();
        this.interaction = interaction;
    }

    /**
     * ボタンの種類を特定
     * @return {import("../data/Type").ButtonType}
     */
    buttonType () {
        if (this.interaction.customId === `addCommandButton`) return { type: `command`, operation: `add`, message: this.interaction.message };
        if (this.interaction.customId === `editCommandButton`) return { type: `command`, operation: `edit`, message: this.interaction.message };
        if (this.interaction.customId === `removeCommandButton`) return { type: `command`, operation: `remove`, message: this.interaction.message };
        if (this.interaction.customId === `addTemplateButton`) return { type: `template`, operation: `add`, message: this.interaction.message };
        if (this.interaction.customId.startsWith(`template`)) return { type: `template`, operation: `set`, message: this.interaction.message };
        if (this.interaction.customId === `backButton`) return { type: `pages`, operation: `back`, message: this.interaction.message };
        if (this.interaction.customId === `nextButton`) return { type: `pages`, operation: `next`, message: this.interaction.message };
    }

    /**
     * ButtonInteraction.showModal()
     * @param {import("../data/Type").ShowModalOptions} options
     */
    showModal (options) {
        if (options.type === `command`) {
            /** コマンド管理ボタン */
            switch (options.operation) {
                case `add`:
                    this.interaction.showModal(addCommandModal);
                    break;
                case `edit`:
                    this.interaction.showModal(editCommandModal);
                    break;
                case `remove`:
                    this.interaction.showModal(removeCommandModal);
                    break;
                default:
                    break;
            }
        }
        if (options.type === `template`) {
            /** テンプレート追加ボタン */
            switch (options.operation) {
                case `add`:
                    this.interaction.showModal(addTemplateModal);
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * コマンド管理パネルを1ページ戻す
     * @param {import("discord.js").Message} message コマンド管理パネルのメッセージオブジェクト
     */
    backPage (message) {
        const embeds = message.embeds;
        const components = message.components;
        const currentPage = Number(embeds[0].footer.text.split(` | `)[1].split(`/`)[0]);
        const newPageIndex = currentPage - 2;
        const pages = JSON.parse(readFileSync(path.resolve(__dirname, `../data/ManagePanelPages.json`), { encoding: `utf-8` }));
        const newContent = pages[newPageIndex].join(`\n`);
        embeds[0].fields[0].value = newContent;
        embeds[0].footer.text = `現在のページ | ${newPageIndex + 1}/${pages.length}`;
        /* ページ数が２ページだけの時 */
        if (newPageIndex === 0 && newPageIndex === pages.length - 2) {
            components[0].components[0].setDisabled(true);
            components[0].components[1].setDisabled(false);
            message.edit({ embeds, components });
            this.interaction.deferUpdate();
        } else {
            /* 1ページ目になったときはBACKボタンを無効化 */
            if (newPageIndex === 0) {
                components[0].components[0].setDisabled(true);
                message.edit({ embeds, components });
                this.interaction.deferUpdate();
            } else if (newPageIndex === pages.length - 2) {
                /* 最後のページから一つ前のページに移動時にNEXTボタンを有効化 */
                components[0].components[1].setDisabled(false);
                message.edit({ embeds, components });
                this.interaction.deferUpdate();
            } else {
                /* それ以外はただ内容を変更 */
                message.edit({ embeds });
                this.interaction.deferUpdate();
            }
        }
    }

    /**
     * コマンド管理パネルを1ページ進める
     * @param {import("discord.js").Message} message コマンド管理パネルのメッセージオブジェクト
     */
    nextPage (message) {
        const embeds = message.embeds;
        const components = message.components;
        const currentPage = Number(embeds[0].footer.text.split(` | `)[1].split(`/`)[0]);
        const newPageIndex = currentPage;
        const pages = JSON.parse(readFileSync(path.resolve(__dirname, `../data/ManagePanelPages.json`), { encoding: `utf-8` }));
        const newContent = pages[newPageIndex].join(`\n`);
        embeds[0].fields[0].value = newContent;
        embeds[0].footer.text = `現在のページ | ${newPageIndex + 1}/${pages.length}`;
        /* ページ数が２つだけの時 */
        if (newPageIndex === pages.length - 1 && newPageIndex === 1) {
            components[0].components[1].setDisabled(true);
            components[0].components[0].setDisabled(false);
            message.edit({ embeds, components });
            this.interaction.deferUpdate();
        } else {
            /* 最後のページになったときはNEXTボタンを無効化 */
            if (newPageIndex === pages.length - 1) {
                components[0].components[1].setDisabled(true);
                message.edit({ embeds, components });
                this.interaction.deferUpdate();
            } else if (newPageIndex === 1) {
                /* 1ページ目から次のページに移動時にBACKボタンを有効化 */
                components[0].components[0].setDisabled(false);
                message.edit({ embeds, components });
                this.interaction.deferUpdate();
            } else {
                message.edit({ embeds });
                this.interaction.deferUpdate();
            }
        }
    }

    /**
     * コマンド管理チャンネルのテンプレートからコマンドを変更する
     * @async
     * @returns {{isSuccess: boolean, command: import("../data/Type").CommandName | undefined, value: CommandValue | undefined, message: "コマンドが見つかりませんでした" | undefined}}
     */
    async setCommandByTemplate () {
        const command = this.interaction.message.embeds[0].title;
        const value = this.interaction.component.label;
        const result = super.edit(command, value);
        super.createCommandPagesPrivate();
        super.createCommandPagesPublic();
        await super.syncCommandPanel(this.interaction.client);
        if (result) return { isSuccess: true, command, value };
        if (!result) return { isSuccess: false, message: `コマンドが見つかりませんでした` };
    }

    /**
     * <ButtonInteraction>.reply()
     * @param {string} content
     * @param {boolean} [isEphemeral=true]
     */
    reply (content, isEphemeral = true) {
        this.interaction.reply({ content, ephemeral: isEphemeral });
    }
};

module.exports = { DiscordButton };
