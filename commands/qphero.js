const Yamdbf = require('yamdbf');
const Discord = require('discord.js');
const Constants = require('../lib/util/Constants.js');
const OverwatchStatsLoader = require('../lib/overwatch/stats-loader.js');

/**
 * Discord bot command for quickplay stats for a specific hero
 */
class QuickplayHero extends Yamdbf.Command {
  constructor (bot) {
    super (bot, {
      name: 'qphero',
      alias: ['qph'],
      description: 'Show Overwatch quickplay stats for a particular hero',
      usage: [
        '<prefix>qphero <hero>- for general quickplay stats for a specific hero using your linked battletag\n',
        '<prefix>qphero <hero> <battletag> - for general quickplay stats for a specific using a given battletag\n'
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
      battletag: args[1],
      hero: args[0],
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

exports.default = QuickplayHero;