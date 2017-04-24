/**
 * Main executor for the bot
 * Will connect to discord and join appropriate guild
 */

const path = require('path');
const Bot = require('yamdbf').Bot;
const Config = require('./config/bot-config.json');
const Env = process.env;

const bot = new Bot({
  name: 'Omnic',
  token: Env.BOT_TOKEN,
  config: Config,
  selfbot: false,
  version: '1.0.0',
  statusText: 'gastinowatch',
  commandsDir: path.join(__dirname, 'commands')
})
.setDefaultSetting('prefix', '.')
.start();