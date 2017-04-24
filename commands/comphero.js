const Yamdbf = require('yamdbf');
const Discord = require('discord.js');
const Constants = require('../lib/util/Constants.js');

const OverwatchStatsLoader = require('../lib/overwatch/stats-loader.js');

class CompHero extends Yamdbf.Command {
  constructor (bot) {
    super (bot, {
      name: 'comphero',
      alias: ['ch'],
      description: 'Show Overwatch competitive stats for a particular hero',
      usage: [
        '<prefix>comphero <hero>- for general competitive stats for a specific hero using your linked battletag\n',
        '<prefix>comphero <hero> <battletag> - for general competitive stats for a specific hero using a given battletag\n'
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
      mode: Constants.overwatch.mode.competitive,
      message: message
    });

    statsLoader.fetchStats().then(response => {
      return message.channel.sendEmbed(response);
    }, error => {
      return message.channel.sendEmbed(error);
    });
  }
}

exports.default = CompHero;