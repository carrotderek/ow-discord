let Yamdbf = require('yamdbf');
let Discord = require('discord.js');
let Constants = require('../lib/util/Constants.js');

let OverwatchStatsLoader = require('../lib/overwatch/stats-loader.js');

exports.default = class CompStats extends Yamdbf.Command {
  constructor (bot) {
    super (bot, {
      name: 'compstats',
      alias: ['ow'],
      description: 'Show Overwatch competitive stats',
      usage: [
        '<prefix>compstats - for general competitive stats for your linked battletag\n',
        '<prefix>compstats <battletag> - for general competitive stats for a given battletag\n'
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
      battletag: args[0],
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