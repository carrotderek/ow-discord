let Discord = require('discord.js');
let OverwatchRequest = require('./requests.js');
let OverwatchFormatter = require('./formatter.js');
let Constants = require('../util/Constants.js');
let Collection = require('discord.js').Collection;

class OverwatchStatsLoader {
  constructor (bot, battletag, mode) {
    this._bot = bot;
    this._battletag = battletag;
    this._mode = mode;
    this._collection = new Collection();
    this._embed;
  }

  fetchStats () {
    return new Promise((resolve, reject) => {
      if (!this._battletag) {
        this._embed = new Discord.RichEmbed();
        this._embed.setColor(Constants.colors.error)
          .setDescription(`**Error**: ${message.author}: Unable to find associated battletag, use the .bnetlink command to associate your battle.net account.`);

        reject(this._embed);
      }

      let ow = new OverwatchRequest(this._bot, this._collection, this._battletag);

      ow.getStats().then(response => {
        let formatter = new OverwatchFormatter(response, {battletag: this._battletag, mode: this._mode});
        resolve(formatter.buildGeneralStats());
      }, error => {
        this._embed = new Discord.RichEmbed();
        this._embed.setColor(Constants.colors.error)
          .setDescription(`${error}`);
        reject(this._embed);
      });
    })
  }
}

module.exports = OverwatchStatsLoader;