const { nowDate } = require("./nowDate.js")
const fs = require("fs")
const path = require("path")

exports.readyLogForTwitch = () => {
    const now = nowDate()
    console.log(`【${now}】 ready by twitch client`)
}

exports.readyLogForDiscord = () => {
    const now = nowDate()
    console.log(`【${now}】 ready by discord client`)
}

exports.commandLogForTwitch = (commandName, tag) => {
    const logs = fs.readFileSync(path.resolve(__dirname, "../../log.csv"), { encoding: "utf-8" }, (err) => {console.log(err)})
    const users = require("../jsons/users.json")
    users[tag.username] = 0000000000000
    const newUsers = JSON.stringify(users, null, "\t")
    const now = nowDate()
    const log = `【${now}】 : twitch command !${commandName} by ${tag.username} |${commandName}|`
    console.log(log)
    const newLogs = logs + "\n" + log
    fs.writeFileSync(path.resolve(__dirname, "../jsons/users.json"), newUsers, (err) => {console.log(err)})
    fs.writeFileSync(path.resolve(__dirname, "../../log.csv"), newLogs, (err) => {console.log(err)})
}

exports.commandLogForDiscord = (commandName, author) => {
    const logs = fs.readFileSync(path.resolve(__dirname, "../../log.csv"), { encoding: "utf-8" }, (err) => { console.log(err) })
    const now = nowDate()
    const log = `【${now}】 : discord command !${commandName} by ${author.tag} |${commandName}|`
    console.log(log)
    const newLogs = logs + "\n" + log
    fs.writeFileSync(path.resolve(__dirname, "../../log.csv"), newLogs, (err) => { console.log(err) })
}