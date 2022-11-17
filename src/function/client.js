const { Client, Intents } = require(`discord.js`);
const tmi = require(`tmi.js`);
const app = require(`express`)();
const http = require(`http`);

/**
 * discordクライアントを作成
 * @return {import("discord.js").Client}
 */
exports.createDiscordClientNotLogged = () => {
    /** @type {import("discord.js").ClientOptions} */
    const clientOptions = {
        intents: Object.values(Intents.FLAGS),
        partials: [`MESSAGE`, `REACTION`, `CHANNEL`]
    };

    const client = new Client(clientOptions);
    return client;
};

/**
 * twitchクライアントを作成
 * @param {string} token
 * @param {{name: string, connectChannels: string[]}} connectOptions
 * @returns {import("tmi.js").Client}
 */
exports.createTwitchClientNotLogged = (token, connectOptions) => {
    /** @type {import("tmi.js").Options} */
    const clientOptions = {
        connection: {
            secure: true,
            reconnect: true
        },
        identity: {
            username: connectOptions.name,
            password: token
        },
        channels: connectOptions.connectChannels
    };

    const client = new tmi.Client(clientOptions);
    return client;
};

exports.createExpressApp = () => {
    const server = http.createServer(app);
    server.listen(process.env.PORT, () => {
        console.log(`express http server listening at http://localhost:${process.env.PORT}`);
    });
    return app;
};
