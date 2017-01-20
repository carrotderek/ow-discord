const path = require('path');
const Bot = require('yamdbf').Bot;
const Config = require('./config.json');
const Env = process.env;

const bot = new Bot({
  name: 'Gayfag',
  token: Env.BOT_TOKEN,
  config: Config,
  selfbot: false,
  version: '1.0.0',
  statusText: 'try @mention help',
  commandsDir: path.join(__dirname, 'commands')
}).start();