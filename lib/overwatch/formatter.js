let Discord = require('discord.js');
let HumanReadable = require('./key-mappings.json');
let Constants = require('../util/Constants.js');

class OverwatchFormatter {

  constructor (data, options) {
    this._data = data;
    this._mode = options.mode || 'quickplay';
    this._battletag = options.battletag;
    this._hero = options.hero || null;
    this._statsReference = this._data.stats[this._mode];
    this._heroReference = this._data.heroes.stats[this._mode];
    this._color = Constants.colors.overwatch.quickplay;
    if (this._mode === Constants.overwatch.mode.competitive) this._color = Constants.colors.overwatch.competitive;

    this._embed = new Discord.RichEmbed()
      .setColor(this._color);
  }

  buildGeneralStats () {
    let overallStats = this._buildOverallStats();
    let avgStats = this._buildAvgStats();

    this._embed
      .setAuthor(`Overwatch stats: ${this._battletag}`, this._statsReference.overall_stats.avatar)
      .setDescription(`Game mode: ${this._mode}`);

    this._fieldGenerator(overallStats, 'overall');
    this._embed.addField('\u200b', '\u200b');
    this._fieldGenerator(avgStats, 'average');

    return this._embed;
  }

  buildHeroStats () {
    let overallStats = this._buildOverallStats(this._heroReference[this._hero].general_stats);
    this._embed
      .setAuthor(`${this._hero} stats: ${this._battletag}`, this._statsReference.overall_stats.avatar)
      .setDescription(`Game mode: ${this._mode}`);

    this._fieldGenerator(overallStats, 'overall');

    return this._embed;
  }

  _fieldGenerator (map, humanReadableKey) {
    map.forEach((value, key, i) => {
      this._embed.addField(HumanReadable[humanReadableKey][key], value, true);
    });
  }

  _buildOverallStats (context = this._statsReference.game_stats) {
    let overall = this._statsReference.overall_stats;
    let map = new Map();

    map.set('level', (overall.prestige * 100) + overall.level);
    map.set('sr-tier', `${overall.comprank}/${overall.tier}`);
    map.set('time_played', `${context.time_played} hours`);

    if (context.eliminations_per_life) {
      map.set('elims_per_life', context.eliminations_per_life);
    } else {
      map.set('ed_ratio', context.kpd);
    }

    if (this._mode === Constants.overwatch.mode.quickplay) {
      map.set('wins', context.games_won);
      map.set('on-fire', `${((context.time_spent_on_fire/context.time_played) * 100).toFixed(1)}%`);
    } else {
      map.set('record', `${context.games_won}-${context.games_lost}-${context.games_tied}`);
      map.set('win_rate', `${(context.games_won/(context.games_won + context.games_lost + context.games_tied) * 100).toFixed(1)}%`);
    }

    return map;
  }

  _buildAvgStats () {
    let average = this._statsReference.average_stats;
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