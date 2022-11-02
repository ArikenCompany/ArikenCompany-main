exports.nowDate = () => {
    const date = new Date()
    const nowYear = date.getFullYear()
    const nowMonth = date.getMonth() + 1
    const nowDay = date.getDate()
    const nowHour = date.getHours()
    const nowMinutes = date.getMinutes()
    const nowSeconds = date.getSeconds()
    const result = nowYear + "/" + nowMonth + "/" + nowDay + " " + nowHour + ":" + nowMinutes + ":" + nowSeconds
    return result;
}