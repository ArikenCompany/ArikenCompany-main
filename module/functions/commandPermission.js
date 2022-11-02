exports.twtchNormalCommandPermission = (tag, command) => {
    const coolTimes = require("../jsons/coolTime.json")
    const blackList = require("../jsons/blackList.json")
    const { coolTime, onCommand, onCoolTime } = require("../jsons/config.json")

    const useCommandPussible = (useCommand) => {
        if (onCoolTime && onCommand) {
            if (coolTimes[useCommand] !== undefined) {
                const now = Date.now()
                const time = now - coolTimes[useCommand]
                const currentCoolTime = coolTime * 1000
                if (currentCoolTime < time) {
                    return true;
                } else {
                    return false
                }
            } else {
                return true;
            }
        } else {
            return false
        }
    }

    //mod or non mod
    if (!tag.mod) {
        //blacklist
        if (!blackList[tag.username]) {
            //cooltime
            if (useCommandPussible(command)) {
                return true;
            } else {return false;}
        } else {return false;}
    } else {
        return true;
    }
}

exports.twtchAdminCommandPermission = (tag) => {
    const { admins } = require("../jsons/config.json")
    if (tag.mod) {
        return true;
    } else {
        if (admins[tag.username]) {
            return true
        } else {
            return false
        }
    }
}

exports.twitchCommandIsAdmin = (cmd) => {
    if (cmd === "cmd" || cmd === "command") {
        return true
    } else {
        return false
    }
}