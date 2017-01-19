const Discord = require('discord.io');
const Logger = require('./logger.js');
const Config = require('../config.json');
const Commands = require('./commands/manager.js');

class Bot {
  constructor (token) {
    this.token = token;
    this.client = {};
    this.commands = {};
    this.logger = new Logger();
    this.config = Config;
    this.command_regex = new RegExp(`^${this.settings.trigger}\\s+([^\\s]+)\\s*([^]*)\\s*`, 'i');
  }

  onReady () {
    return (() => {
      this.logger.info('Connected to Discord');
      this.logger.info('Connected as: ',this.client.username, '(', this.client.id, ')');

      this.client.setPresence({
        game: {
          name: '!help for commands'
        }
      });

      // initialize commands
      // Object.keys(this.commands).forEach(cmd => {
      //   if (typeof this.commands[cmd].init === 'function') {
      //     this.commands[cmd].init(this);
      //   }
      // });
    });
  }

  onMessage () {
    return (message => {

    });
  }

  onError () {
    return ((err) => {
      this.logger.error('ERROR: ', err);
      this.logger.error(err.trace);
    });
  }

  init () {

    this.logger.info('Connecting...');
    this.client = new Discord.Client({
      'token': this.token,
      'autorun': true
    });

    this.logger.info('Setting up events...');
    this.client
      .on('ready', this.onReady())
      .on('message', this.onMessage())
      .on('error', this.onError());
  }
}

module.exports = Bot;