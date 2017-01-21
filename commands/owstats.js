let Yamdbf = require('yamdbf');
let Discord = require('discord.js');
let Overwatch = require('../lib/overwatch.js');
let Constants = require('../lib/util/Constants.js');

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
    let battletag = guildStorage.getItem(message.author.id).battletag;

    if (!battletag) {
      msg.setColor(Constants.colors.error)
        .setDescription(`**Error**: ${message.author}: Unable to find associated battletag`);
    } else {
      let coo = new Overwatch(battletag);
      coo.getStats();

    }



    message.channel.sendEmbed(msg);
  }
};