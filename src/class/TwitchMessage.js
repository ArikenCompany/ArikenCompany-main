const { Manage } = require(`./Manage`);
const util = require(`../function/index`);
const { writeFileSync, readFileSync } = require(`fs`);
const path = require(`path`);

/**
 * Twitch messageのクラス
 * @class
 * @extends Manage
 * @extends Command
 */
class TwitchMessage extends Manage {
    /**
     * @param {import("tmi.js").Client} twitchClient
     * @param {import("discord.js").Client} discordClient
     * @param {import("../data/Type").TwitchMessageOptions} options
     */
    constructor (twitchClient, discordClient, options) {
        super();
        this.twitchClient = twitchClient;
        this.discordClient = discordClient;
        this.channel = options.channel;
        this.user = options.user;
        this.commandArr = options.message.toLowerCase().split(` `);
        this.self = options.self;
        this.messageCounter();
    };

    /**
     * コメント数カウント
     * - /data/MessageCounter.jsonに保存
     */
    messageCounter = () => {
        const name = this.user.username;
        const messageCounts = JSON.parse(readFileSync(path.resolve(__dirname, `../data/MessageCounter.json`), { encoding: `utf-8` }));
        if (messageCounts[name] === undefined) {
            messageCounts[name] = 0;
            const writeData = JSON.stringify(messageCounts, null, `\t`);
            writeFileSync(path.resolve(__dirname, `../data/MessageCounter.json`), writeData);
        } else {
            messageCounts[name] = messageCounts[name] + 1;
            const writeData = JSON.stringify(messageCounts, null, `\t`);
            writeFileSync(path.resolve(__dirname, `../data/MessageCounter.json`), writeData);
        }
    };

    /**
     * コマンドが使用可能か判別
     * - 管理権限持ち、VIPは無条件true
     * - 現在のクールタイムを確認 → それ以上空いていればtrue
     * @returns {boolean}
     */
    isUsableCommand () {
        const coolTime = JSON.parse(readFileSync(path.resolve(__dirname, `../data/CoolTime.json`), { encoding: `utf-8` }));
        const { managers } = JSON.parse(readFileSync(path.resolve(__dirname, `../data/CommandManager.json`), { encoding: `utf-8` }));
        const { isOnCommand } = JSON.parse(readFileSync(path.resolve(__dirname, `../config/settings.json`), { encoding: `utf-8` }));
        const command = this.commandArr[0];

        if (this.user.mod) return true;
        if (managers.includes(this.user.username)) return true;
        if (this.user.badges.vip) return true;
        if (this.user.badges.broadcaster) return true;
        if (!isOnCommand) return false;
        const currentCoolTime = JSON.parse(readFileSync(path.resolve(__dirname, `../config/settings.json`), { encoding: `utf-8` })).coolTime * 1000;
        if (coolTime[command] === undefined) return true;
        const diffFromLastTime = Date.now() - coolTime[command];
        if (diffFromLastTime > currentCoolTime) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * メッセージがコマンドか判別
     * @returns {boolean}
     */
    isCommand () {
        if (!this.commandArr[0].startsWith(`!`) && !this.commandArr[0].startsWith(`！`)) {
            return false;
        } else {
            if (this.self) {
                return false;
            } else {
                return true;
            }
        }
    };

    /**
     * 管理コマンドか判別
     * @returns {boolean}
     */
    isManageCommand () {
        return util.command.isManageCommand(this.commandArr[0]);
    }

    /**
     * コマンド使用者が管理者権限を持っているか判別
     * - true : 配信主, モデレーター, 別コマンドで指定された者
     * - false : VIP, その他当てはまらない者
     * @returns {boolean}
     */
    isManager () {
        const { managers } = JSON.parse(readFileSync(path.resolve(__dirname, `../data/CommandManager.json`), { encoding: `utf-8` }));
        if (this.user.mod) return true;
        if (this.user.badges.broadcaster) return true;
        if (managers.includes(this.user.username)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 実行時の時間を記録
     * - this.isManager()がtrueの人は記録されない
     * @returns {}
     */
    loggingCoolTime () {
        if (this.isManager()) return;
        const now = Date.now();
        const command = this.commandArr[0];
        const coolTime = JSON.parse(readFileSync(path.resolve(__dirname, `../data/CoolTime.json`), { encoding: `utf-8` }));
        coolTime[command] = now;
        const writeData = JSON.stringify(coolTime, null, `\t`);
        writeFileSync(path.resolve(__dirname, `../data/CoolTime.json`), writeData);
        return;
    };

    /**
     * 管理コマンドの引数を調べる
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
     * @returns {{ isSucceed: boolean, message: string}}
     */
    async addCommand (command, value) {
        const isValidResult = super.isValidArgs(value);
        if (isValidResult.isValid === false) return { isSucceed: false, message: isValidResult.message };
        const isSuccessed = super.add(command, value);
        if (isSuccessed) {
            super.createCommandPagesPrivate();
            super.createCommandPagesPublic();
            await super.syncCommandPanel(this.discordClient);
            return { isSucceed: true, message: `${command} を追加` };
        } else {
            return { isSucceed: false, message: `SyntaxError: 存在するコマンド名か無効なコマンド名` };
        };
    };

    /**
     * コマンドを編集
     * @async
     * @param {import("../data/Type").CommandName} command
     * @param {import("../data/Type").CommandValue} value
     * @returns {{ isSucceed: boolean, message: string}}
     */
    async editCommand (command, value) {
        const isValidResult = super.isValidArgs(value);
        if (isValidResult.isValid === false) return { isSucceed: false, message: isValidResult.message };
        const isSuccessed = super.edit(command, value);
        if (isSuccessed) {
            super.createCommandPagesPrivate();
            super.createCommandPagesPublic();
            await super.syncCommandPanel(this.discordClient);
            return { isSucceed: true, message: `${command} を ${value} に変更` };
        } else {
            return { isSucceed: false, message: `SyntaxError: 存在しないコマンド名か無効なコマンド名` };
        };
    };

    /**
     * コマンドを削除
     * @async
     * @param {import("../data/Type").CommandName} command
     * @returns {{ isSucceed: boolean, message: string}}
     */
    async removeCommand (command) {
        const isSuccessed = super.remove(command);
        if (isSuccessed) {
            super.createCommandPagesPrivate();
            super.createCommandPagesPublic();
            await super.syncCommandPanel(this.discordClient);
            return { isSucceed: true, message: `${command} を削除` };
        } else {
            return { isSucceed: true, message: `SyntaxError: 存在しないコマンド名か無効なコマンド名` };
        };
    };

    /**
     * 現在のクールタイムを確認
     * @returns {string}
     */
    checkCurrentCoolTime () {
        const result = util.coolTime.checkCurrentCoolTime();
        return result;
    };

    setCoolTime (value) {
        const isSuccessed = super.setCoolTime(value);
        if (isSuccessed) {
            const result = `クールタイムを${value}秒に変更`;
            return result;
        } else {
            return `TypeError: 無効な秒数です。数のみを指定してください。`;
        }
    };

    /**
     * @return {import("../data/Type").CommandValueArgs}
     */
    searchCommandValueArgs () {
        const commands = JSON.parse(readFileSync(path.resolve(__dirname, `../data/Commands.json`), { encoding: `utf-8` }));
        /** @type {string} */
        const command = `!` + this.commandArr[0].slice(1);
        const value = commands[command];
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

    reply (content) {
        this.twitchClient.say(this.channel, content);
    };
};

module.exports = { TwitchMessage };
