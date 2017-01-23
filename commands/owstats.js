let Yamdbf = require('yamdbf');
let Discord = require('discord.js');
let Overwatch = require('../lib/overwatch/ow.js');
let OverwatchFormatter = require('../lib/overwatch/formatter.js');
let Constants = require('../lib/util/Constants.js');
let Collection = require('discord.js').Collection;

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
    this.collection = new Collection();
  }

  action (message, args, mentions, original) {
    let guildStorage = this.bot.guildStorages.get(message.guild);
    let battletag = guildStorage.getItem(message.author.id).battletag || null;
    let msg;

    if (!battletag) {
      msg = new Discord.RichEmbed();
      msg.setColor(Constants.colors.error)
        .setDescription(`**Error**: ${message.author}: Unable to find associated battletag, use the .bnetlink command to associate your battle.net account.`);

      return message.channel.sendEmbed(msg);
    }

    let ow = new Overwatch(this.bot, this.collection, battletag);
    let gameMode = 'quickplay';

    if (args.indexOf('comp') > -1) gameMode = 'competitive';

    ow.getStats().then(response => {
      let formatter = new OverwatchFormatter(response, {battletag: battletag, mode: gameMode });
      let generalStats = formatter.buildGeneralStats();
      return message.channel.sendEmbed(generalStats);

    }, error => {
      msg = new Discord.RichEmbed();
      msg.setColor(Constants.colors.error)
        .setDescription(`${error}`);
      return message.channel.sendEmbed(msg);
    });
  }

};