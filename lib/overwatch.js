let request = require('request');
let Constants = require('./util/Constants.js');

module.exports = class Overwatch {
  constructor (battletag) {
    this.battletag = battletag.replace('#', '-');
  }

  getStats (competitive = false) {
    request({
      url: Constants.endpoints.overwatch.general(this.battletag),
      headers: {
        'User-Agent': 'request'
      }
    }, (error, response, body) => {
      console.log(body);
    });

    if (competitive) {

    }
  }
}
