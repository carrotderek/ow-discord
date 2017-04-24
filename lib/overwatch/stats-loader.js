const Discord = require('discord.js');
const Collection = require('discord.js').Collection;
const OverwatchRequest = require('./requests.js');
const OverwatchFormatter = require('./formatter.js');
const Constants = require('../util/Constants.js');

/**
 * Main gateway class for fetching/retrieving and formatting overwatch stats
 */
class OverwatchStatsLoader {

  /**
   * Constructor initializes inputs for API
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  constructor (options) {
    this._bot = options.bot || null;
    this._battletag = options.battletag || null;
    this._collection = new Collection();
    this._hero = options.hero || null;
    this._message = options.message || {};
    this._mode = options.mode || Constants.overwatch.mode.quickplay;
  }

  /**
   * Retrieve data form the API and format it
   * @return {Promise} Resolved if stats can be retrieved and formatted
   *                   Reject if battletag is not associated or unable to find hero specific data
   */
  fetchStats () {
    return new Promise((resolve, reject) => {
      let guildStorage, battletag, request;

      if (!this._battletag) {
        try {
          // retrieve cached battletag from Discord's guild storage if any
          guildStorage = this._bot.guildStorages.get(this._message.guild);
          this._battletag = guildStorage.getItem(this._message.author.id).battletag || null;
        } catch (TypeError) {
          this._embed = new Discord.RichEmbed()
            .setColor(Constants.colors.error)
            .setDescription('You must associate your Discord account with your battle.net battletag. Use bnetlink command to do so');
          reject(this._embed);
        }
      }

      request = new OverwatchRequest(this._bot, this._collection, this._battletag);

      request.getStats().then(response => {
        const formatter = new OverwatchFormatter(response, {
          battletag: this._battletag,
          hero: this._hero,
          mode: this._mode
        });

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
    });
  }
}

module.exports = OverwatchStatsLoader;