let Yamdbf = require('yamdbf');
let Discord = require('discord.js');
let Constants = require('../lib/util/Constants.js');

let OverwatchStatsLoader = require('../lib/overwatch/stats-loader.js');

exports.default = class QuickplayStats extends Yamdbf.Command {
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
    let options = {
      bot: this.bot,
      battletag: args[1],
      hero: args[0],
      mode: Constants.overwatch.mode.competitive,
      message: message
    }

    let statsLoader = new OverwatchStatsLoader(options);
    statsLoader.fetchStats().then(response => {
      return message.channel.sendEmbed(response);
    }, error => {
      return message.channel.sendEmbed(error);
    });
  }
};