const Bot = require('./bot/bot.js');
const Env = process.env;

function initialize() {
  var token = Env.BOT_TOKEN;

  if (!token) {
    throw Error('Missing Discord token');
  }

  (new Bot(token).init());
}

initialize();