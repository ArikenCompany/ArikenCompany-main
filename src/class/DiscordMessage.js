const { Manage } = require(`./Manage`);
const util = require(`../function/index`);
const path = require(`path`);
const { discordModRole } = require(`../config/settings.json`);
const { readFileSync } = require(`fs`);

/**
 * messageCreateのクラス
 * @class
 * @extends Manage
 * @extends Command
 */
class DiscordMessage extends Manage {
    /**
     * @param {import("discord.js").Message} message
     */
    constructor (message) {
        super();
        this.message = message;
        this.commandArr = message.content.toLowerCase().split(` `);
    };

    /**
     * メッセージがコマンドか判別
     * @returns {boolean}
     */
    isCommand () {
        if (!this.commandArr[0].startsWith(`!`) && !this.commandArr[0].startsWith(`！`)) {
            return false;
        } else {
            if (this.message.author.bot) {
                return false;
            } else {
                return true;
            }
        }
    };

    /**
     * コマンドが管理コマンドか判別
     * @returns {boolean}
     */
    isManageCommand () {
        return util.command.isManageCommand(this.commandArr[0]);
    }

    /**
     * コマンド使用者が管理者か判別
     * @returns {boolean}
     */
    isAuthorMod () {
        if (this.message.member.roles.cache.has(discordModRole)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 管理コマンドの引数を確定
     * @return {import("../data/Type").ManageArgs}
     */
    searchManageArgs () {
        const commandArr = this.commandArr;
        const addComs = [`!addcom`];
        const editComs = [`!editcom`];
        const removeComs = [`!removecom`, `!rmcom`];
        const checkCoolTimeComs = [`!cooltime`, `!ct`];
        const setCoolTimeComs = [`!setcooltime`, `!setct`];

        const first = commandArr[0];
        const second = commandArr[1];
        commandArr.shift();
        commandArr.shift();
        const value = commandArr.join(` `);
        /* add */
        if (addComs.includes(first)) return { manageArgs: `add`, firstArg: second, secondArg: value };
        /* edit */
        if (editComs.includes(first)) return { manageArgs: `edit`, firstArg: second, secondArg: value };
        /* remove */
        if (removeComs.includes(first)) return { manageArgs: `remove`, firstArg: second, secondArg: value };
        /* check cool time */
        if (checkCoolTimeComs.includes(first)) return { manageArgs: `checkCoolTime` };
        /* set cool time */
        if (setCoolTimeComs.includes(first)) return { manageArgs: `setCoolTime`, firstArg: second };
    };

    /**
     * コマンドを追加
     * @async
     * @param {import("../data/Type").CommandName} command
     * @param {import("../data/Type").CommandValue} value
     * @returns {string}
     */
    async addCommand (command, value) {
        const isValidResult = super.isValidArgs(value);
        if (isValidResult.isValid === false) return this.reply(isValidResult.message);
        const isSucceed = super.add(command, value);
        if (isSucceed) {
            const result = `${command} を追加`;
            super.createCommandPagesPrivate();
            super.createCommandPagesPublic();
            await super.syncCommandPanel(this.message.client);
            return result;
        } else {
            return `SyntaxError: 存在するコマンド名か無効なコマンド名`;
        };
    };

    /**
     * コマンドを編集
     * @async
     * @param {import("../data/Type").CommandName} command
     * @param {import("../data/Type").CommandValue} value
     * @returns {string}
     */
    async editCommand (command, value) {
        const isValidResult = super.isValidArgs(value);
        if (isValidResult.isValid === false) return this.reply(isValidResult.message);
        const isSucceed = super.edit(command, value);
        if (isSucceed) {
            const result = `${command} を ${value} に変更`;
            super.createCommandPagesPrivate();
            super.createCommandPagesPublic();
            await super.syncCommandPanel(this.message.client);
            return result;
        } else {
            return `SyntaxError: 存在しないコマンド名か無効なコマンド名`;
        };
    };

    /**
     * コマンドを削除
     * @async
     * @param {import("../data/Type").CommandName} command
     * @returns {string}
     */
    async removeCommand (command) {
        const isSucceed = super.remove(command);
        if (isSucceed) {
            const result = `${command} を削除`;
            super.createCommandPagesPrivate();
            super.createCommandPagesPublic();
            await super.syncCommandPanel(this.message.client);
            return result;
        } else {
            return `SyntaxError: 存在しないコマンド名か無効なコマンド名`;
        };
    };

    /**
     * 現在のコマンドクールタイムを返す
     * @returns {string} current command cooltime
     */
    checkCurrentCoolTime () {
        const result = util.coolTime.checkCurrentCoolTime();
        return result;
    };

    /**
     * クールタイムを変更
     * @param {string} value
     * @returns {string}
     */
    setCoolTime (value) {
        const isSucceed = super.setCoolTime(value);
        if (isSucceed) {
            const result = `クールタイムを${value}秒に変更`;
            return result;
        } else {
            return `TypeError: 無効な秒数です。数のみを指定してください。`;
        }
    };

    /**
     * コマンドの内容の引数を判定
     * @return {import("../data/Type").CommandValueArgs}
     */
    searchCommandValueArgs () {
        const commands = JSON.parse(readFileSync(path.resolve(__dirname, `../data/Commands.json`), { encoding: `utf-8` }));
        /** @type {string} */
        const value = commands[this.commandArr[0]];
        if (value === undefined) return { isModCommand: false, args: undefined, value: undefined };
        if (value.startsWith(`mod`)) {
            const str = value.slice(4);
            if (!str.startsWith(`fetch`) && !str.startsWith(`alias`)) return { isModCommand: true, args: undefined, value: str };
            if (str.startsWith(`fetch`)) return { isModCommand: true, args: `fetch`, value: str.slice(6) };
            if (str.startsWith(`alias`)) return { isModCommand: true, args: `alias`, value: str.slice(6) };
        } else {
            if (!value.startsWith(`fetch`) && !value.startsWith(`alias`)) return { isModCommand: false, args: undefined, value };
            if (value.startsWith(`fetch`)) return { isModCommand: false, args: `fetch`, value: value.slice(6) };
            if (value.startsWith(`alias`)) return { isModCommand: false, args: `alias`, value: value.slice(6) };
        }
    };

    /**
     * Message.reply()
     * @param {string} content
     */
    reply (content) {
        this.message.reply(content);
    }
}

module.exports = { DiscordMessage };
