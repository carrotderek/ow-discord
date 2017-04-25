const request = require('request');
const Constants = require('../util/constants.js');
const Timer = require('../util/timer.js');

/**
 * Request class for connecting to Overwatch API
 */
class OverwatchRequest {

  /**
   * Constructor initializes input for the api
   * @param  {Yamdbf.Bot}         bot        Reference for bot
   * @param  {Discord.Collection} collection Our cache
   * @param  {String}             battletag  Battletag to fetch stats for
   */
  constructor (bot, collection, battletag) {
    this._battletag = battletag.replace('#', '-');
    this._bot = bot;
    this._statistics = collection;
  }

  /**
   * Retrive JSON data from Overwatch API and attempt to cache in Discord Collection
   * @return {Promise} Resolved if successfully retrieved data; 
   *                   Rejected for invalid battletag or connectivity issues with API
   */
  getStats () {
    return new Promise((resolve, reject) => {
      let stats = this._statistics.get(this._battletag);
      if (stats) resolve(stats);

      request({
        url: Constants.overwatch.endpoints.general(this._battletag),
        headers: { 'User-Agent': 'request' }
      }, (error, response, body) => {
        stats = JSON.parse(body);
        // I'm an asshole and not providing worldwide support
        if (!stats.us) reject(Error(`Profile for ${this._battletag} could not be found`));

        if (!error && response.statusCode === 200) {
          this._statistics.set(this._battletag, stats.us);
          this.timer = new Timer(
            this._bot,
            this._battletag, 10*60, () => {
              this._statistics.delete(this._battletag);
              this.timer.destroy();
          });

          resolve(stats.us);
        } else {
          this._statistics.set('error', { error: 'Error conecting to OWAPI', code: 1 });
          reject(Error('Error connecting to OWAPI'));
        }
      });
    });
  }
}

module.exports = OverwatchRequest;
