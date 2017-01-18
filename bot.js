var logger = require('winston'),
  DiscordBot = require('discord.io'),
  auth,
  bot;


logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  colorize: true
});

env = require('./auth.json');
bot = new DiscordBot({
  email: env.email,
  password: env.password,
  autorun: true
});

bot.on('ready', function () {
  logger.info('bot:connected');
  logger.info('bot:logged-in as:');
  logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userId, channelId, message, event) {

});