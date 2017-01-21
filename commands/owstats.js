let Yamdbf = require('yamdbf');
let Discord = require('discord.js');

exports.default = class Stats extends Yamdbf.Command {
  constructor (bot) {
    super (bot, {
      name: 'owstats',
      alias: ['ow'],
      description: 'Show Overwatch stats',
      usage: [
        '<prefix>owstats - for general quickplay stats\n',
        '<prefix>owstats <hero> - for hero-specific quickplay stats\n',
        '<prefix>owstats comp - for general competitive stats\n',
        '<prefix>owstats comp <hero> - for hero-specific competitive stats'
      ].join(''),
      group: 'games',
      guildOnly: false,
      permissions: [],
      roles: [],
      ownerOnly: false
    });
  }

  action (message, args, mentions, original) {
    let msg = new Discord.RichEmbed();
    let guildStorage = this.bot.guildStorages.get(message.guild);

    message.channel.sendEmbed(msg);
  }
};