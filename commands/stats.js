let Yamdbf = require('yamdbf');
let Discord = require('discord.js');

exports.default = class Stats extends Yamdbf.Command {
  constructor (bot) {
    super (bot, {
      name: 'stats',
      alias: ['st'],
      description: 'Display info for the bot',
      usage: '<prefix>stats',
      group: 'base',
      guildOnly: false,
      permissions: [],
      roles: [],
      ownerOnly: false
    });
  }

  action (message, args, mentions, original) {
    var msg = new Discord.RichEmbed()
      .setColor(11854048)
      .setAuthor('Omnic info', this.bot.user.avartarUrl)
      .addField('Mem Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
      .addField('\u200b', '\u200b', true)
      .addField('Servers', this.bot.guilds.size.toString(), true)
      .addField('Channels', this.bot.channels.size.toString(), true)
      .addField('Users', this.bot.users.size)
      .addField('YAMDBF', `v${Yamdbf.version}`, true)
      .addField('Discord.js', `v${Discord.version}`)
      .addField('\u200b', '\u200b', true)
      .addField('Bot source', '[Available on Github](https://github.com/carrotderek/ow-discord', true)
      .setTimestamp();

    message.channel.sendEmbed(msg);
  }
};