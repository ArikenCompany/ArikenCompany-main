const axios = require("axios")
const config = require("../jsons/config.json")
const coolTimes = require("../jsons/coolTime.json")
const path = require("path")
const fs = require("fs")
const https = require("https")
const rankMap = {
    "Iron": "アイアン",
    "Bronze": "ブロンズ",
    "Silver": "シルバー",
    "Gold": "ゴールド",
    "Platinum": "プラチナ",
    "Diamond": "ダイヤモンド"
}
exports.getUrl = (url) => {
    return new Promise((resolve, reject) => {
        axios.get(url,
            {
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                })
            })
            .then(function (res) {
                resolve(res.data)
            })
            .catch((error) => console.log(error))
    })
}

// const rankToJpn = (rank) => {
//     const [type, place, _2, t] = rank.split(" ")
//     const [tier] = t.split("R");
//     return `${rankMap[type]} ${place} | ${tier}pt`
// }

// const uptimeToJpn = (uptime) => {
//     if (uptime === "arikendebu is offline") return "オフライン";
//     const uptimeArr = uptime.split(" ")
//     if (uptimeArr[5] === undefined) {
//         if (uptimeArr[3] !== undefined) {
//             if (uptimeArr[1].startsWith("hour") && uptimeArr[3].startsWith("minute") && uptimeArr[5] === undefined) {
//                 const result = uptimeArr[0] + "時間" + uptimeArr[2] + "分"
//                 return result;
//             }
//             if (uptimeArr[1].startsWith("hour") && uptimeArr[3].startsWith("second") && uptimeArr[5] === undefined) {
//                 const result = uptimeArr[0] + "時間" + uptimeArr[2] + "秒"
//                 return result;
//             }
//             if (uptimeArr[1].startsWith("minute") && uptimeArr[3].startsWith("second")) {
//                 const result = uptimeArr[0] + "分" + uptimeArr[2] + "秒"
//                 return result
//             }
//         } else {
//             if (uptimeArr[1].startsWith("hour") && uptimeArr[3] === undefined) {
//                 const result = uptimeArr[0] + "時間"
//                 return result;
//             }

//             if (uptimeArr[1].startsWith("minute") && uptimeArr[3] === undefined) {
//                 const result = uptimeArr[0] + "分"
//                 return result;
//             }
//             if (uptimeArr[1].startsWith("second") && uptimeArr[3] === undefined) {
//                 const result = uptimeArr[0] + "秒"
//                 return result;
//             }
//         }
//     } else {
//         if (uptimeArr[1].startsWith("hour") && uptimeArr[3].startsWith("minute") && uptimeArr[5].startsWith("second")) {
//             const result = uptimeArr[0] + "時間" + uptimeArr[2] + "分" + uptimeArr[4] + "秒"
//             return result;
//         }
//     }
// }

// exports.rank = async (url) => {
//     const rankEng = await getUrl(url)
//     const result = rankToJpn(rankEng)
//     return result;
// }

// exports.uptime = async (url) => {
//     const uptimeEng = await getUrl(url)
//     const result = uptimeToJpn(uptimeEng)
//     return result
// }

// exports.wins = async (url) => {
//     const matches = await getUrl(url)
//     var winCount = 0
//     for (let i = 0; i < matches.data.length; i++) {
//         const result = matches.data[i].players.all_players.find(d => d.name === config.arikenValorantId)
//         if (result.team === "Red") {
//             if (matches.data[i].teams.red.has_won === true) {
//                 winCount = winCount + 1
//             }
//             if (matches.data[i].teams.red.has_won === false) {
//             }
//         }
//         if (result.team === "Blue") {
//             if (matches.data[i].teams.blue.has_won === true) {
//                 winCount = winCount + 1
//             }
//             if (matches.data[i].teams.blue.has_won === false) {
//             }
//         }
//     }
//     const winPer = (winCount / matches.data.length) * 100
//     const win = winCount
//     const lose = 5 - winCount
//     return `直近ランク5試合の勝率 : ${win}W${lose}L | ${winPer}%`;
// }

exports.controlCooltimes = (command, tag) => {
    if (!tag.mod) {
        const date = Date.now()
        coolTimes[command] = date
        const writeData = JSON.stringify(coolTimes, null, "\t")
        fs.writeFileSync(path.resolve(__dirname, "../jsons/coolTime.json"), writeData, (err) => { console.log(err) })
    } else {
        return;
    }
}