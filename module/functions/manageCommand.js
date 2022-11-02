const path = require("path")
const fs = require("fs")
const config = require("../jsons/config.json")
const commands = require("../jsons/commands.json")
const blacklists = require("../jsons/blackList.json")

exports.onCommand = () => {
    config.onCommand = true
    const writeData = JSON.stringify(config, null, "\t")
    fs.writeFileSync(path.resolve(__dirname, "../jsons/config.json"), writeData, (err) => { console.log(err) })
}

exports.offCommand = () => {
    config.onCommand = false
    const writeData = JSON.stringify(config, null, "\t")
    fs.writeFileSync(path.resolve(__dirname, "../jsons/config.json"), writeData, (err) => { console.log(err) })
}

exports.addCommand = (target, value) => {
    const commandName = target.substring(1)
    if (commands[commandName] !== undefined) return "構文エラー"
    commands[commandName] = value
    const writeData = JSON.stringify(commands, null, "\t")
    fs.writeFileSync(path.resolve(__dirname, "../jsons/commands.json"), writeData, (err) => { console.log(err) })
    const result = `${target} を追加`
    return result;
}

exports.editCommand = (target, value) => {
    const commandName = target.substring(1)
    if (commands[commandName] === undefined) return "構文エラー"
    commands[commandName] = value
    const writeData = JSON.stringify(commands, null, "\t")
    fs.writeFileSync(path.resolve(__dirname, "../jsons/commands.json"), writeData, (err) => { console.log(err) })
    const result = `${target} を ${value} に変更`
    return result;
}

exports.removeCommand = (target) => {
    const commandName = target.substring(1)
    if (commands[commandName] === undefined) return "構文エラー"
    delete commands[commandName]
    const writeData = JSON.stringify(commands, null, "\t")
    fs.writeFileSync(path.resolve(__dirname, "../jsons/commands.json"), writeData, (err) => { console.log(err) })
    const result = `${target} を削除`
    return result;
}

exports.returnCurrentCooltime = () => {
    const result = `現在のクールタイム設定 ${config.coolTime} 秒`
    return result;
}

exports.setCoolTime = (newCoolTime) => {
    config.coolTime = Number(newCoolTime)
    const writeData = JSON.stringify(config, null, "\t")
    fs.writeFileSync(path.resolve(__dirname, "../jsons/config.json"), writeData, (err) => { console.log(err) })
    const result = `クールタイムを ${config.coolTime} 秒に変更`
    return result
}

exports.addBlackList = (name) => {
    if (blacklists[name] !== undefined) return `${name}はすでにブラックリストに追加されています。`
    blacklists[name] = true
    const writeData = JSON.stringify(blacklists, null, "\t")
    fs.writeFileSync(path.resolve(__dirname, "../jsons/blackList.json"), writeData, (err) => {console.log(err)})
    const result = `${name} をブラックリストに追加`
    return result;
}

exports.removeBlackList = (name) => {
    if (blacklists[name] === undefined) return `${name}はブラックリストに追加されていません。`
    delete blacklists[name]
    const writeData = JSON.stringify(blacklists, null, "\t")
    fs.writeFileSync(path.resolve(__dirname, "../jsons/blackList.json"), writeData, (err) => {console.log(err)})
    const result = `${name} をブラックリストから削除`
    return result;
}

exports.presetMemberSolo = () => {
    commands["member"] = "ソロ"
    const writeData = JSON.stringify(commands, null, "\t")
    fs.writeFileSync(path.resolve(__dirname, "../jsons/commands.json"), writeData, (err) => { console.log(err) })
    const result = `!member を ソロ に変更`
    return result;
}

exports.presetNowValo = () => {
    commands["now"] = "VALORANT"
    const writeData = JSON.stringify(commands, null, "\t")
    fs.writeFileSync(path.resolve(__dirname, "../jsons/commands.json"), writeData, (err) => { console.log(err) })
    const result = `!now を ソロ に変更`
    return result;
}

exports.presetNowSumabura = () => {
    commands["now"] = "スマブラ"
    const writeData = JSON.stringify(commands, null, "\t")
    fs.writeFileSync(path.resolve(__dirname, "../jsons/commands.json"), writeData, (err) => { console.log(err) })
    const result = `!now を スマブラ に変更`
    return result;
}

exports.presetNowSpla = () => {
    commands["now"] = "Splatoon 3"
    const writeData = JSON.stringify(commands, null, "\t")
    fs.writeFileSync(path.resolve(__dirname, "../jsons/commands.json"), writeData, (err) => { console.log(err) })
    const result = `!now を Splatoon 3 に変更`
    return result;
}

exports.presetNowApex = () => {
    commands["now"] = "APEX"
    const writeData = JSON.stringify(commands, null, "\t")
    fs.writeFileSync(path.resolve(__dirname, "../jsons/commands.json"), writeData, (err) => { console.log(err) })
    const result = `!now を APEX に変更`
    return result;
}

exports.presetNowTalk = () => {
    commands["now"] = "雑談"
    const writeData = JSON.stringify(commands, null, "\t")
    fs.writeFileSync(path.resolve(__dirname, "../jsons/commands.json"), writeData, (err) => { console.log(err) })
    const result = `!now を 雑談 に変更`
    return result;
}

