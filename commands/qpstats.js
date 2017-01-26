let Yamdbf = require('yamdbf');
let Discord = require('discord.js');
let Constants = require('../lib/util/Constants.js');

let OverwatchStatsLoader = require('../lib/overwatch/stats-loader.js');

exports.default = class QuickplayStats extends Yamdbf.Command {
  constructor (bot) {
    super (bot, {
      name: 'qpstats',
      alias: ['ow'],
      description: 'Show Overwatch quickplay stats',
      usage: [
        '<prefix>qpstats - for general quickplay stats for your linked battletag\n',
        '<prefix>qpstats <battletag> - for general quickplay stats for a given battletag\n'
      ].join(''),
      group: 'games',
      guildOnly: false,
      permissions: [],
      roles: [],
      ownerOnly: false
    });
  }

  action (message, args, mentions, original) {
    let battletag = args[0];
    let guildStorage;

    if (!battletag) {
      try {
        guildStorage = this.bot.guildStorages.get(message.guild);
        battletag = guildStorage.getItem(message.author.id).battletag || null;
      } catch (TypeError) {
        let embed = new Discord.RichEmbed()
          .setColor(Constants.colors.error)
          .setDescription('You must associate your Discord account with your battle.net battletag. Use bnetlink command to do so');
        return message.channel.sendEmbed(embed);
      }
    }

    let statsLoader = new OverwatchStatsLoader(this.bot, battletag, Constants.overwatch.mode.quickplay);
    statsLoader.fetchStats().then(response => {
      return message.channel.sendEmbed(response);
    }, error => {
      return message.channel.sendEmbed(error);
    });
  }
};