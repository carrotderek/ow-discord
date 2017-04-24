const Discord = require('discord.js');
const OverwatchDataDict = require('../../config/format-config.json');
const Constants = require('../util/Constants.js');

/**
 *  Formatter class for Overwatch statistics
 */
class OverwatchFormatter {

  /**
   * Constructor accepts data returned from API with options and initalizes Discord RichEmbed obj
   * @param  {Object} data    Data returned from OWAPI as an object
   * @param  {Object} options Options include (game)mode, battletag, or specific hero
   */
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

  /**
   * Constructs general statistics for a player in a RichEmbed object
   * @return {RichEmbed} RichEmbed object containing overall and average gameplay statistics
   */
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

  /**
   * Constructs hero-specific statistics within a RichEmbed object
   * @return {RichEmbed} RichEmbed object containing hero-specific statistics
   */
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

  /**
   * Iterator for presenting keys as user-friendly strings and adding them as a field in RichEmbed
   * @param  {Map} map Map object containing specific gameplay data
   * @param  {String} referenceKey Provide context what kind of data
   */
  _fieldGenerator (map, referenceKey) {
    map.forEach((value, key, i) => {
      let context = OverwatchDataDict.ux_config.strings[referenceKey][key];

      if (referenceKey === 'specific_hero') 
        context = OverwatchDataDict.ux_config.strings[referenceKey][this._hero][key];

      this._embed.addField(context, value, true);
    });
  }

  /**
   * Iterator for building a Map object for the data
   * @param  {Object} dataset Gameplay data as an Object
   * @param  {Object} context For which dataset we're building for -- core stats, optional, hero-specific
   * @return {Map}            Sanitized data as a Map
   */
  _mapGenerator (dataset, context) {
    const map = new Map();

    context.forEach(key => {
      let data = dataset[key];

      if (data) {
        // map should be 1:1 unless we need to format percentages
        if (OverwatchDataDict.ux_config.requires_percentage.indexOf(key) !== -1)
          data = `${(data*100).toFixed(1)}%`;

        map.set(key, data);
      }
    });

    return map;
  }

  /**
   * Populate map with overall stats -- because of the degree of formatting, this is more manual
   * @param  {Object} context Which data set we're building overall stats for -- general or hero-specific
   * @return {Map}            The sanitized data as a Map
   */
  _buildOverallStats (context = this._statsReference.game_stats) {
    const overall = this._statsReference.overall_stats;
    const map = new Map();
    let tierValue = `${overall.comprank}/${overall.tier}`;
    let gameTotal, gamesTied = 0;

    map.set('level', (overall.prestige * 100) + overall.level);

    if (!overall.comprank)
      tierValue = 'Unplaced this season';
  
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

  /**
   * Build a new map for general stats for a specific hero (ie. avg. dmg)
   * @return {Map} Sanitized general stats for a specific hero as a Map
   */
  _buildGeneralHeroStats () {
    const dataset = this._heroReference[this._hero].general_stats;
    const reference = OverwatchDataDict.stat_structure.heroes;
    let coreStats, optionalStats;

    coreStats = this._mapGenerator(dataset, reference.core);
    optionalStats = this._mapGenerator(dataset, reference.optional);

    return new Map([...coreStats, ...optionalStats]);
  }

  /**
   * Build a new map for specific stats for a hero (ie. barrage kills, roadhog hooks)
   * @return {Map} Sanitized specific stats for a hero as a Map
   */
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