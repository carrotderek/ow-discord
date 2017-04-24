const Yamdbf = require('yamdbf');
const LocalStorage =  Yamdbf.LocalStorage;

/**
 * Timer class for when to expire cache from the bot local storage
 */
class Timer {
  constructor (bot, name, interval, callback) {
    this.name = name;
    this._storage = new LocalStorage(`storage/timers/${this.name}`);
    this._bot = bot;
    this._interval = interval;
    this._callback = callback;
    this._ticks = this._storage.getItem(this.name) || 0;

    this.create();
  }

  /**
   * Create the timer and set the ticks in local storage
   * @return {[type]} [description]
   */
  create () {
    if (this._timer)
      throw new Error('Timer has already been created');

    this._timer = this._bot.setInterval(() => {
      if (this._ticks >= this._interval) this._ticks = 0;
      if (this._ticks++ === 0) this._callback();

      this._storage.setItem(this.name, this._ticks);
    }, 1000);
  }

  /**
   * Reset the ticks and remove the timer from local storage
   * @return {[type]} [description]
   */
  destroy () {
    this._bot.clearInterval(this._timer);
    this._ticks = 0;
    this._timer = null;
    this._storage.setItem(this.name, this._ticks);
  }
}

module.exports = Timer;