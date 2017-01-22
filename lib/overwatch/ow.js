let request = require('request');
let Constants = require('../util/Constants.js');
let Timer = require('../util/timer.js');

module.exports = class Overwatch {
  constructor (bot, collection, battletag) {
    this._battletag = battletag.replace('#', '-');
    this._bot = bot;
    this._statistics = collection;
  }

  getStats () {
    return new Promise((resolve, reject) => {
      let stats = this._statistics.get(this._battletag);
      if (stats) resolve(stats);

      request({
        url: Constants.endpoints.overwatch.general(this._battletag),
        headers: { 'User-Agent': 'request' }
      }, (error, response, body) => {
        stats = JSON.parse(body).us.stats;

        if (!error && response.statusCode === 200) {
          this._statistics.set(this._battletag, stats);
          new Timer(this._bot, this._battletag, 10*60, () => { this._statistics.delete(this._battletag)});

          resolve(stats);
        } else {
          this._statistics.set('error', { error: 'Error conecting to OWAPI', code: 1 });
          reject(Error('Error connecting to OWAPI'));
        }
      });
    });

  }
}
