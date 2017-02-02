let Discord = require('discord.js');
let OverwatchRequest = require('./requests.js');
let OverwatchFormatter = require('./formatter.js');
let Constants = require('../util/Constants.js');
let Collection = require('discord.js').Collection;

class OverwatchStatsLoader {
  constructor (options) {
    this._bot = options.bot || null;
    this._battletag = options.battletag || null;
    this._mode = options.mode || Constants.overwatch.mode.quickplay;
    this._message = options.message || {}
    this._collection = new Collection();
    this._embed;
  }

  fetchStats () {
    return new Promise((resolve, reject) => {
      let guildStorage, battletag;

      if (!this._battletag) {
        try {
          guildStorage = this._bot.guildStorages.get(this._message.guild);
          this._battletag = guildStorage.getItem(this._message.author.id).battletag || null;
        } catch (TypeError) {
          this._embed = new Discord.RichEmbed()
            .setColor(Constants.colors.error)
            .setDescription('You must associate your Discord account with your battle.net battletag. Use bnetlink command to do so');
          reject(this._embed);
        }
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