let Discord = require('discord.js');
let HumanReadable = require('./key-mappings.json');
let Constants = require('../util/Constants.js');

class OverwatchFormatter {

  constructor (data, options) {
    this.data = data;
    this.mode = options.mode || 'quickplay';
    this.battletag = options.battletag;
    this.reference = this.data[this.mode];
    this.embed = new Discord.RichEmbed();
  }

  buildGeneralStats () {
    let overallStats = this._buildOverallStats();
    let avgStats = this._buildAvgStats();

    this.embed.setColor(Constants.colors.info)
      .setAuthor(`Overwatch ${this.mode} statistics for ${this.battletag}`, this.reference.overall_stats.avatar);

    this._fieldGenerator(overallStats, 'overall');
    this.embed.addField('\u200b', '\u200b');
    this._fieldGenerator(avgStats, 'average');

    return this.embed;
  }

  _fieldGenerator (map, humanReadableKey) {
    map.forEach((value, key, i) => {
      this.embed.addField(HumanReadable[humanReadableKey][key], value, true);
    });
  }

  _buildOverallStats () {
    let overall = this.reference.overall_stats;
    let game = this.reference.game_stats;
    let map = new Map();

    map.set('level', (overall.prestige * 100) + overall.level);
    map.set('tier', overall.tier);
    map.set('rank', overall.comprank);
    map.set('time_played', `${game.time_played} hours`);
    map.set('ed_ratio', game.kpd);

    if (this.mode === 'quickplay') {
      map.set('wins', overall.wins);
    } else {
      map.set('win_rate', `${(overall.wins/(overall.wins + overall.losses) * 100).toFixed(1)}%`);
    }

    return map;
  }

  _buildAvgStats () {
    let average = this.reference.average_stats;
    let map = new Map();

    map.set('elims_avg', average.eliminations_avg);
    map.set('deaths_avg', average.deaths_avg);
    map.set('dmg_avg', average.damage_done_avg);
    map.set('healing_avg', average.healing_done_avg);
    map.set('final_blows_avg', average.final_blows_avg);
    map.set('solo_kills_avg', average.solo_kills_avg);
    // map.set('objective_kills_avg', average.objective_kills_avg);
    // map.set('objective_time_avg', average.objective_time_avg);

    return map;
  }
}

module.exports = OverwatchFormatter;