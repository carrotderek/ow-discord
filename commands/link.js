let Yamdbf = require('yamdbf');
let Discord = require('discord.js');
let Constants = require('../lib/util/Constants.js');


exports.default = class Stats extends Yamdbf.Command {
  constructor (bot) {
    super (bot, {
      name: 'bnetlink',
      alias: ['bnl', 'link'],
      description: 'Associate your Discord account with your battle.net account',
      usage: '<prefix>bnetlink <battletag>',
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
    let regex = new RegExp('^\\D.{2,11}#\\d{4}$');

    if (!args[0]) {
      msg.setColor(Constants.colors.error)
        .setDescription('**Error**: Battletag not provided');
    } else if (args[0].match(regex)) {
      guildStorage.setItem(message.author.id, { battletag: args[0] });

      msg.setColor(Constants.colors.success)
        .setDescription(`**Success**: ${message.author}: You are now associated to **${args[0]}**`);
    } else {
      msg.setColor(Constants.colors.error)
        .setDescription(`**Error**: Invalid battletag: ${args[0]}`);
    }

    message.channel.sendEmbed(msg);
  }
};