const { Manage } = require(`./Manage`);
const { MessageActionRow } = require(`discord.js`);
const { addTemplateButton, addCommandButton, editCommandButton, removeCommandButton, backButton, nextButton } = require(`../data/Components`);
const { writeFileSync, readFileSync } = require(`fs`);
const path = require(`path`);

/**
 * CommandInteractionのクラス
 * @class
 * @extends Manage
 * @extends Command
 */
class DiscordCommand extends Manage {
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    constructor (interaction) {
        super();
        this.interaction = interaction;
    }

    /**
     * スラッシュコマンドの引数を特定
     * @returns {import("../data/Type").SlashCommandArgs}
     */
    searchCommand () {
        if (this.interaction.options.getSubcommand() === `panel`) {
            /* コマンド管理パネルセットアップ */
            return { arg: `panel` };
        }
        if (this.interaction.options.getSubcommand() === `template`) {
            /* コマンド管理テンプレートセットアップ */
            const command = this.interaction.options.getString(`command`);
            return { arg: `template`, value: command };
        }
    };

    /**
     * - コマンド管理パネルを作成、送信
     * - 送信したパネルのメッセージIDをsettings.jsonに保存
     * @async
     */
    async createPanel () {
        const pages = super.createCommandPagesPrivate();
        const firstPageContent = pages[0].join(`\n`);
        const commandPanelEmbed = {
            title: `コマンド一覧`,
            description: `ボタンを押して変更する内容を入力`,
            fields: [
                {
                    name: `------------------------`,
                    value: firstPageContent
                }
            ],
            footer: {
                text: `現在のページ | 1/${pages.length}`
            }
        };
        backButton.setDisabled(true);
        const controllerRow = new MessageActionRow().addComponents(backButton, nextButton);
        const manageRow = new MessageActionRow().addComponents(addCommandButton, editCommandButton, removeCommandButton);
        const message = await this.interaction.channel.send({ embeds: [commandPanelEmbed], components: [controllerRow, manageRow] });
        const config = JSON.parse(readFileSync(path.resolve(__dirname, `../config/settings.json`), { encoding: `utf-8` }));
        config.discordManageMessage = message.id;
        const writeData = JSON.stringify(config, null, `\t`);
        writeFileSync(path.resolve(__dirname, `../config/settings.json`), writeData);
    }

    /**
     * コマンド管理テンプレートを作成 @type {string}
     * @param {string} command starts with "!"
     */
    createTemplate (command) {
        const commands = JSON.parse(readFileSync(path.resolve(__dirname, `../data/Commands.json`), { encoding: `utf-8` }));
        if (!command.startsWith(`!`)) return `SyntaxError: 無効なコマンド名です`;
        if (commands[command] === undefined) return `SyntaxError: 存在しないコマンド名です`;
        /** @type {import("discord.js").MessageEmbedOptions} */
        const commandTemplateEmbed = {
            title: command,
            description: `ボタンを押すとあらかじめ設定された値に変更`
        };
        const addRow = new MessageActionRow().addComponents(addTemplateButton);
        this.interaction.channel.send({ embeds: [commandTemplateEmbed], components: [addRow] });
    }

    /**
     * CommandInteraction.reply()
     * @param {string} content
     * @param {boolean} [isEphemeral=true]
     */
    reply (content, isEphemeral = true) {
        this.interaction.reply({ content, ephemeral: isEphemeral });
    }
};

module.exports = { DiscordCommand };
