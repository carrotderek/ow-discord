let Discord = require('discord.js');
let OverwatchDataDict = require('./key-mappings.json');
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
    this._embed
      .setAuthor(`Overwatch stats: ${this._battletag}`, this._statsReference.overall_stats.avatar)
      .setDescription(`Game mode: ${this._mode}`);

    this._fieldGenerator(this._buildOverallStats(), 'overall');
    this._embed.addField('\u200b', '\u200b');
    this._fieldGenerator(
      this._mapGenerator(this._statsReference.average_stats, OverwatchDataDict.stat_structure.overall.average),
      'average'
    );

    return this._embed;
  }

  buildHeroStats () {
    this._embed
      .setAuthor(`${this._hero} stats: ${this._battletag}`, this._statsReference.overall_stats.avatar)
      .setDescription(`Game mode: ${this._mode}`);

    this._fieldGenerator(this._buildOverallStats(this._heroReference[this._hero].general_stats), 'overall');
    this._embed.addField('\u200b', '\u200b');
    this._fieldGenerator(this._buildGeneralHeroStats(), 'general_hero');
    this._embed.addField('\u200b', '\u200b');
    this._fieldGenerator(this._buildSpecificHeroStats(), 'specific_hero');

    return this._embed;
  }

  _fieldGenerator (map, humanReadableKey) {
    map.forEach((value, key, i) => {
      let context = OverwatchDataDict.ux_config.strings[humanReadableKey][key];
      if (humanReadableKey === 'specific_hero') 
        context = OverwatchDataDict.ux_config.strings[humanReadableKey][this._hero][key];

      this._embed.addField(context, value, true);
    });
  }

  _mapGenerator (dataset, context) {
    let map = new Map();
    context.forEach(key => {
      let data = dataset[key];

      if (data) {
        if (OverwatchDataDict.ux_config.requires_percentage.indexOf(key) !== -1)
          data = `${(data*100).toFixed(1)}%`;

        map.set(key, data);
      }
    });

    return map;
  }

  _buildOverallStats (context = this._statsReference.game_stats) {
    let overall = this._statsReference.overall_stats;
    let map = new Map();
    let tierValue = `${overall.comprank}/${overall.tier}`;
    let gameTotal, gamesTied = 0;

    map.set('level', (overall.prestige * 100) + overall.level);

    if (!overall.comprank) {
      tierValue = 'Unplaced this season';
    }
    map.set('sr-tier', tierValue);
    map.set('time_played', `${context.time_played.toFixed(1)} hours`);

    if (context.eliminations_per_life) {
      map.set('elims_per_life', context.eliminations_per_life);
    } else {
      map.set('ed_ratio', context.kpd);
    }

    if (this._mode === Constants.overwatch.mode.quickplay) {
      map.set('wins', context.games_won);
      map.set('on-fire', `${((context.time_spent_on_fire/context.time_played) * 100).toFixed(1)}%`);
    } else {
      if (context.games_tied) gamesTied = context.games_tied;
      map.set('record', `${context.games_won}-${context.games_lost}-${gamesTied}`);
      map.set('win_rate', `${(context.games_won/(context.games_won + context.games_lost + gamesTied) * 100).toFixed(1)}%`);
    }

    return map;
  }

  _buildGeneralHeroStats () {
    let dataset = this._heroReference[this._hero].general_stats;
    let reference = OverwatchDataDict.stat_structure.heroes;
    let coreStats, optionalStats;

    coreStats = this._mapGenerator(dataset, reference.core, false);
    optionalStats = this._mapGenerator(dataset, reference.optional);

    return new Map([...coreStats, ...optionalStats]);
  }

  _buildSpecificHeroStats () {
    let map;
    if (OverwatchDataDict.stat_structure.heroes.specific[this._hero]) {
      map = this._mapGenerator(
        this._heroReference[this._hero].hero_stats,
        OverwatchDataDict.stat_structure.heroes.specific[this._hero]
      );
    }

    return map;
  }
}

module.exports = OverwatchFormatter;