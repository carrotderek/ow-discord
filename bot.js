const Logger = require('winston');
const Discord = require('discord.io');
const Env = process.env

var bot;
Logger.remove(Logger.transports.Console);
Logger.add(Logger.transports.Console, {
  colorize: true
});

bot = new Discord.Client({
  autorun: true,
  token: Env.BOT_TOKEN
});

bot.on('ready', function () {
  Logger.info('bot:connected');
  Logger.info('bot:logged-in as:' + bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userId, channelId, message, event) {

});