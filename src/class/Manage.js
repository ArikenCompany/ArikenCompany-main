const axios = require(`axios`);
const { writeFileSync, readFileSync } = require(`fs`);
const path = require(`path`);
const https = require(`https`);

/**
 * axios.get(url)
 * @param {string} url
 * @returns {string | object}
 */
const getUrl = (url) => {
    return new Promise((resolve, reject) => {
        axios.get(url,
            {
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                })
            })
            .then(function (res) {
                resolve(res.data);
            })
            .catch((error) => console.log(error));
    });
};

/**
 * コマンド引数操作クラス
 * - alias
 * - fetch
 * @class
 */
class Command {
    /**
     * url fetch
     * @async
     * @param {string} url
     * @return {string | object}
     */
    async fetch (url) {
        const result = await getUrl(url);
        return result;
    };

    /**
     * alias command
     * @param {string} command
     * @return {string}
     */
    alias (command) {
        const commands = JSON.parse(readFileSync(path.resolve(__dirname, `../data/Commands.json`), { encoding: `utf-8` }));
        if (!commands[command]) return `alias先のコマンドが存在しません`;
        return commands[command];
    }
};

/**
 * コマンド管理クラス
 * @class
 * @extends Command
 */
class Manage extends Command {
    constructor () {
        super();
    };

    /**
     * コマンドの内容が構文的に有効か確かめる
     * @param {import("../data/Type").CommandValue} value
     * @return { { isValid: boolean, message: string | undefined } }
     */
    isValidArgs (value) {
        /* 何も引数がないときは無条件true */
        if (!value.startsWith(`mod`) && !value.startsWith(`alias`) && !value.startsWith(`fetch`)) return { isValid: true };
        /* modから始まる */
        if (value.startsWith(`mod`)) {
            if (!value.startsWith(`mod `)) return { isValid: false, message: `SyntaxError: modの後は半角スペースが必要です` };
            const newValue = value.slice(4);
            if (!newValue.startsWith(`alias`) && !newValue.startsWith(`fetch`)) return { isValid: true };
            if (newValue.startsWith(`alias`)) {
                const finalValue = newValue.slice(6);
                if (finalValue.startsWith(`mod`) || finalValue.startsWith(`alias`) || finalValue.startsWith(`fetch`)) return { isValid: false, message: `SyntaxError: alias,fetchの後は何も引数を指定できません` };
                const commandIsDefined = this.isDefined(finalValue);
                if (commandIsDefined) return { isValid: true };
                if (!commandIsDefined) return { isValid: false, message: `SyntaxError: 存在しないコマンド名です` };
            } else {
                const finalValue = newValue.slice(6);
                if (finalValue.startsWith(`mod`) || finalValue.startsWith(`alias`) || finalValue.startsWith(`fetch`)) return { isValid: false, message: `SyntaxError: alias,fetchの後は何も引数を指定できません` };
                return { isValid: true };
            }
        } else {
            if (!value.startsWith(`alias !`) && !value.startsWith(`fetch `)) return { isValid: false, message: `SyntaxError: alias, fetchの後は半角スペースとaliasでは!が必要です` };
            if (value.startsWith(`alias`)) {
                const newValue = value.slice(6);
                if (newValue.startsWith(`mod`) || newValue.startsWith(`alias`) || newValue.startsWith(`fetch`)) return { isValid: false, message: `SyntaxError: alias,fetchの後は何も引数を指定できません` };
                const commandIsDefined = this.isDefined(newValue);
                if (commandIsDefined) return { isValid: true };
                if (!commandIsDefined) return { isValid: false, message: `SyntaxError: 存在しないコマンド名です` };
            } else {
                const newValue = value.slice(6);
                if (newValue.startsWith(`mod`) || newValue.startsWith(`alias`) || newValue.startsWith(`fetch`)) return { isValid: false, message: `SyntaxError: alias,fetchの後は何も引数を指定できません` };
                return { isValid: true };
            }
        }
    }

    /**
     * コマンド名からコマンドが存在するか確かめる
     * @param {import("../data/Type").CommandName} command
     * @return {boolean}
     */
    isDefined (command) {
        const commands = JSON.parse(readFileSync(path.resolve(__dirname, `../data/Commands.json`), { encoding: `utf-8` }));
        if (commands[command] === undefined) return false;
        if (commands[command] !== undefined) return true;
    }

    /**
     * コマンドを追加
     * @param {import("../data/Type.js").CommandName} command
     * @param {import("../data/Type.js").CommandValue} value
     */
    add (command, value) {
        const commands = JSON.parse(readFileSync(path.resolve(__dirname, `../data/Commands.json`), { encoding: `utf-8` }));
        if (commands[command] !== undefined || !command.startsWith(`!`)) return false;
        commands[command] = value;
        const writeData = JSON.stringify(commands, null, `\t`);
        writeFileSync(path.resolve(__dirname, `../data/Commands.json`), writeData);
        return true;
    };

    /**
     * コマンドを編集
     * @param {import("../data/Type").CommandName} command
     * @param {import("../data/Type").CommandValue} value
     */
    edit (command, value) {
        const commands = JSON.parse(readFileSync(path.resolve(__dirname, `../data/Commands.json`), { encoding: `utf-8` }));
        if (commands[command] === undefined || !command.startsWith(`!`)) return false;
        commands[command] = value;
        const writeData = JSON.stringify(commands, null, `\t`);
        writeFileSync(path.resolve(__dirname, `../data/Commands.json`), writeData);
        return true;
    };

    /**
     * コマンドを削除
     * @param {import("../data/Type").CommandName} command
     */
    remove (command) {
        const commands = JSON.parse(readFileSync(path.resolve(__dirname, `../data/Commands.json`), { encoding: `utf-8` }));
        if (commands[command] === undefined || !command.startsWith(`!`)) return false;
        delete commands[command];
        const writeData = JSON.stringify(commands, null, `\t`);
        writeFileSync(path.resolve(__dirname, `../data/Commands.json`), writeData);
        return true;
    };

    /**
     * クールタイムを変更する
     * @param {string} value
     */
    setCoolTime (value) {
        if (isNaN(value)) return false;
        const newCoolTime = Number(value);
        const settings = JSON.parse(readFileSync(path.resolve(__dirname, `../config/settings.json`), { encoding: `utf-8` }));
        settings.coolTime = newCoolTime;
        const writeData = JSON.stringify(settings, null, `\t`);
        writeFileSync(path.resolve(__dirname, `../config/settings.json`), writeData);
        return true;
    };

    /**
     * コマンドページを作成 data/ManagePanelPages.jsonに保存
     * @returns {string[][]}
     */
    createCommandPagesPrivate () {
        const commands = JSON.parse(readFileSync(path.resolve(__dirname, `../data/Commands.json`), { encoding: `utf-8` }));

        const commandsKey = Object.keys(commands);
        const commandsValue = Object.values(commands);
        const commandsLength = commandsKey.length;
        const result = Math.floor(commandsLength / 10);
        const over = commandsLength % 10;

        /* 10行マックスのページを作成 */
        /* eslint-disable */
        let pages = [];
        /* eslint-enable */
        for (let i = 1; i < result + 1; i++) {
            const start = (i - 1) * 10;
            const end = i * 10;
            /* eslint-disable */
            let arr = [];
            /* eslint-enable */
            for (let i = start; i < end; i++) {
                arr.push(`**${commandsKey[i]}** ${commandsValue[i]}`);
            }
            pages.push(arr);
        }

        /* あまりのページを作成 */
        /* eslint-disable */
        let overArr = [];
        /* eslint-enable */
        for (let i = 0; i < over; i++) {
            const index = result * 10 + i;
            overArr.push(`**${commandsKey[index]}** ${commandsValue[index]}`);
        }
        if (overArr.length !== 0) pages.push(overArr);
        const writeData = JSON.stringify(pages, null, `\t`);
        writeFileSync(path.resolve(__dirname, `../data/ManagePanelPages.json`), writeData);
        return pages;
    }

    /**
     * コマンドページを作成 fetchのURLを非表示
     * - "fetch https://example.com" → "[fetch]"
     * @returns {object}
     */
    createCommandPagesPublic () {
        const commands = JSON.parse(readFileSync(path.resolve(__dirname, `../data/Commands.json`), { encoding: `utf-8` }));

        const commandsKey = Object.keys(commands);
        const commandsValue = Object.values(commands);
        commandsValue.forEach((value, index) => {
            if (value.includes(`fetch`)) {
                commands[commandsKey[index]] = `[fetch]`;
            }
        });
        const writeData = JSON.stringify(commands, null, `\t`);
        writeFileSync(path.resolve(__dirname, `../data/CommandsPublic.json`), writeData);
        return writeData;
    };

    /**
     * /data/ManagePanelPages.jsonとコマンド管理パネルを同期
     * ページ数に応じてボタンの有効化と無効化も操作
     * @async
     * @param {import("discord.js").Client} client
     */
    async syncCommandPanel (client) {
        const { discordManageChannel, discordManageMessage } = JSON.parse(readFileSync(path.resolve(__dirname, `../config/settings.json`), { encoding: `utf-8` }));
        const channel = client.channels.cache.get(discordManageChannel);
        /** @type {import("discord.js").Message} */
        const message = await channel.messages.fetch(discordManageMessage);
        const embeds = message.embeds;
        const components = message.components;

        const currentPage = Number(embeds[0].footer.text.split(` | `)[1].split(`/`)[0]);
        const currentMaxPage = Number(embeds[0].footer.text.split(` | `)[1].split(`/`)[1]);
        const pages = JSON.parse(readFileSync(path.resolve(__dirname, `../data/ManagePanelPages.json`), { encoding: `utf-8` }));
        if (pages.length === currentMaxPage) {
            if (currentPage === 1) {
                const newPageContent = pages[pages.length - 1].join(`\n`);
                embeds[0].fields[0].value = newPageContent;
                embeds[0].footer.text = `現在のページ | ${pages.length}/${pages.length}`;
                components[0].components[1].setDisabled(true);
                components[0].components[0].setDisabled(false);
                message.edit({ embeds, components });
            } else {
                const newPageContent = pages[pages.length - 1].join(`\n`);
                embeds[0].fields[0].value = newPageContent;
                embeds[0].footer.text = `現在のページ | ${pages.length}/${pages.length}`;
                components[0].components[1].setDisabled(true);
                message.edit({ embeds, components });
            }
        } else {
            if (currentPage === 1) {
                const newPageContent = pages[pages.length - 1].join(`\n`);
                embeds[0].fields[0].value = newPageContent;
                embeds[0].footer.text = `現在のページ | ${pages.length}/${pages.length}`;
                components[0].components[1].setDisabled(true);
                components[0].components[0].setDisabled(false);
                message.edit({ embeds, components });
            } else {
                const newPageContent = pages[pages.length - 1].join(`\n`);
                embeds[0].fields[0].value = newPageContent;
                embeds[0].footer.text = `現在のページ | ${pages.length}/${pages.length}`;
                components[0].components[1].setDisabled(true);
                message.edit({ embeds, components });
            }
        }
    }
};

module.exports = { Manage };
