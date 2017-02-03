let Discord = require('discord.js');
let OverwatchRequest = require('./requests.js');
let OverwatchFormatter = require('./formatter.js');
let Constants = require('../util/Constants.js');
let Collection = require('discord.js').Collection;

class OverwatchStatsLoader {
  constructor (options) {
    this._bot = options.bot || null;
    this._battletag = options.battletag || null;
    this._collection = new Collection();
    this._hero = options.hero || null;
    this._message = options.message || {}
    this._mode = options.mode || Constants.overwatch.mode.quickplay;
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
        let options = {
          battletag: this._battletag,
          hero: this._hero,
          mode: this._mode
        }
        let formatter = new OverwatchFormatter(response, options);

        if (!this._hero) {
          resolve(formatter.buildGeneralStats());
        } else if (!response.heroes.stats[this._mode][this._hero]) {
          this._embed = new Discord.RichEmbed()
            .setColor(Constants.colors.error)
            .setDescription(`Unable to find hero specified: ${this._hero}`);
          reject(this._embed);
        } else {
          resolve(formatter.buildHeroStats(this._hero));
        }

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