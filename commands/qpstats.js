const Yamdbf = require('yamdbf');
const Discord = require('discord.js');
const Constants = require('../lib/util/Constants.js');
const OverwatchStatsLoader = require('../lib/overwatch/stats-loader.js');

/**
 * Discord bot command for quickplay stats
 */
class QuickplayStats extends Yamdbf.Command {
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
    const statsLoader = new OverwatchStatsLoader({
      bot: this.bot,
      battletag: args[0],
      mode: Constants.overwatch.mode.quickplay,
      message: message
    });

    statsLoader.fetchStats().then(response => {
      return message.channel.sendEmbed(response);
    }, error => {
      return message.channel.sendEmbed(error);
    });
  }
}

exports.default = QuickplayStats;