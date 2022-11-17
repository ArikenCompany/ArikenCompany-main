const { discordMessageHandler } = require(`./message`);
const { discordCommandHandler } = require(`./command`);
const { discordButtonHandler } = require(`./button`);
const { discordModalHandler } = require(`./modal`);
const { discordReadyHandler } = require(`./ready`);

module.exports = { discordReadyHandler, discordMessageHandler, discordCommandHandler, discordButtonHandler, discordModalHandler };
