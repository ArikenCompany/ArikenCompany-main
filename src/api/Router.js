const { Router } = require(`express`);
const { responseManagers, responseCommands, responseMessagesRanking } = require(`./routes/index`);

const router = Router();
router
    .get(`/commands`, responseCommands)
    .get(`/managers`, responseManagers)
    .get(`/messages`, responseMessagesRanking);

module.exports = { Router: router };
