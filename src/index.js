(async () => {
    const { isDev } = require(`./config/settings.json`);
    const { createDiscordClientNotLogged, createTwitchClientNotLogged, createExpressApp } = require(`./function/index`).client;
    const { eventHandler } = require(`./event/index`);
    const { Router } = require(`./api/Router`);

    if (isDev) {
        /* 開発環境 */
        require(`dotenv`).config({ path: `.env.development` });
        // 環境変数を変数に代入
        const twitchToken = process.env.TWITCH_TOKEN;
        const twitchName = process.env.CHANNEL_NAME;
        const twitchConnectChannels = process.env.CONNECT_CHANNELS.split(` `);

        const twitchClientConnectOptions = { name: twitchName, connectChannels: twitchConnectChannels };
        const discordClient = createDiscordClientNotLogged();
        const twitchClient = createTwitchClientNotLogged(twitchToken, twitchClientConnectOptions);
        const expressClient = createExpressApp();
        expressClient.use(`/`, Router);
        await eventHandler(discordClient, twitchClient);
    } else {
        /* 本番環境 */
        require(`dotenv`).config({ path: `.env.production` });
        // 環境変数を変数に代入
        const twitchToken = process.env.TWITCH_TOKEN;
        const twitchName = process.env.CHANNEL_NAME;
        const twitchConnectChannels = process.env.CONNECT_CHANNELS.split(` `);

        const twitchClientConnectOptions = { name: twitchName, connectChannels: twitchConnectChannels };
        const discordClient = createDiscordClientNotLogged();
        const twitchClient = createTwitchClientNotLogged(twitchToken, twitchClientConnectOptions);
        const expressClient = createExpressApp();
        expressClient.use(`/`, Router);
        await eventHandler(discordClient, twitchClient);
    };
})();
