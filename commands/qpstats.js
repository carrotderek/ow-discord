let Yamdbf = require('yamdbf');
let Discord = require('discord.js');
let OverwatchRequest = require('../lib/overwatch/requests.js');
let OverwatchFormatter = require('../lib/overwatch/formatter.js');
let Constants = require('../lib/util/Constants.js');
let Collection = require('discord.js').Collection;

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
    this.collection = new Collection();
  }

  action (message, args, mentions, original) {
    let battletag = args[0];
    let guildStorage;

    if (!battletag) {
      guildStorage = this.bot.guildStorages.get(message.guild);
      battletag = guildStorage.getItem(message.author.id).battletag || null;
    }

    let statsLoader = new OverwatchStatsLoader(this.bot, battletag, Constants.overwatch.mode.quickplay);
    let cool = statsLoader.fetchStats().then(response => {
      return message.channel.sendEmbed(response);
    }, error => {
      return message.channel.sendEmbed(error);
    });
  }
};