const Bot = require('./bot.js');
const Env = process.env;

function initialize() {
  var token = Env.BOT_TOKEN;

console.log(token);
  if (!token) {
    throw Error('Missing Discord token');
  }

  (new Bot(token).init());
}

initialize();