const Discord = require('discord.io');
const Logger = require('./logger.js');


class Bot {
  constructor (token) {
    this.token = token;
    this.client = {};
    this.commands = {};
    this.logger = new Logger();
  }

  onReady () {
    return (() => {
      this.logger.info('Connected to Discord');
      this.logger.info('Connected as: ',this.client.username, '(', this.client.id, ')');
      // initialize commands
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