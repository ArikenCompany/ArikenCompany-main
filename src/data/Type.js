/**
 * チャットでのコマンドを管理するコマンドの引数
 * @typedef {object} ManageArgs
 * @prop {"add" | "edit" | "remove" | "checkCoolTime" | "setCoolTime"} manageArgs
 * @prop {string | undefined} firstArg
 * @prop {string | undefined} secondArg
 */

/**
 * TwitchMessageのオプション
 * @typedef {object} TwitchMessageOptions
 * @prop {string} channel
 * @prop {import("tmi.js").ChatUserstate} user
 * @prop {string} message
 * @prop {boolean} self
 */

/**
 * コマンドの内容の引数
 * @typedef {object} CommandValueArgs
 * @prop {boolean} isModCommand
 * @prop {"alias" | "fetch" | undefined} args
 * @prop {string} value
 */

/**
 * ボタンの種類
 * @typedef {object} ButtonType
 * @prop {"command" | "template" | "pages"} type
 * @prop {import("discord.js").Message} message
 * @prop {"add" | "edit" | "remove" | "back" | "next" | "set"} operation
 */

/**
 * スラッシュコマンドの種類
 * @typedef {object} SlashCommandArgs
 * @prop { "panel" | "template" } arg
 * @prop { string | undefined } value
 */

/**
 * ボタンの.showModal()のオプション
 * @typedef {object} ShowModalOptions
 * @prop { "command" | "template"} type
 * @prop { "add" | "edit" | "remove" } operation
 */

/**
 * コマンド管理パネルのembedオブジェクト
 * @typedef {object} CommandPanelEmbed
 * @prop {"コマンド一覧"} title
 * @prop {"ボタンを押して変更する内容を入力"} description
 * @prop { [{ name: "------------------------", value: string }] } fields
 * @prop {{text: "現在のページ | currentPage/pageLength"}} footer
 */

/**
 * - prefix - "!"
 * - プレフィックスから始まるコマンド名
 * @typedef {string} CommandName
 */

/**
 * - args - "mod" "alias" "fetch"
 * - modは必ず先頭に指定
 * @typedef {string} CommandValue
 */

/**
 * コマンド管理テンプレートメッセージのembedオブジェクト
 * @typedef {object} CommandTemplateEmbed
 * @prop {CommandName} title
 * @prop {"ボタンを押すとあらかじめ設定された値に変更"} description
 */
exports.types = {};
