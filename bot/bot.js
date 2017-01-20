const path = require('path');
const Discord = require('discord.js');
const Logger = require('./logger.js');
const Config = require('../config.json');

class Bot {
  constructor (token) {
    this.token = token;
    this.client = new Discord.Client();
    this.commands = {};
    this.logger = new Logger();
    this.config = Config;
    this.command_regex = new RegExp(`^${this.config.trigger}\\s+([^\\s]+)\\s*([^]*)\\s*`, 'i');
  }

  onReady () {
    return (() => {
      this.logger.info('Connected to Discord');
      this.logger.info('Connected as: ',this.client.user.username, '(', this.client.user.id, ')');

      // initialize commands
      Object.keys(this.commands).forEach(cmd => {
        if (typeof this.commands[cmd].init === 'function') {
          this.commands[cmd].init(this);
        }
      });
    });
  }

  onMessage () {
    return (message => {
      var match,
          command,
          commandArgs;

      if (this.client.user.username === message.author.username) { return; }

      match = message.cleanContent.match(this.command_regex);
      command = match[1];
      commandArgs = match[2].trim();

      if (!match || Object.keys(this.commands).indexOf(command) === -1) {
        message.channel.sendMessage('Unrecognized command:', command);
        return;
      }

      try {
        this.commands[command].run(this, message, commandArgs);
      } catch (err) {
        message.channel.sendMessage('Enountered an error running command:\n```\n', err.toString(), '\n```');
        this.logger.error(err);
        this.logger.error(err.trace);
      }

    });
  }

  onError () {
    return ((err) => {
      this.logger.error('ERROR: ', err);
      this.logger.error(err.trace);
    });
  }

  init () {
    this.logger.info('Loading commands');
    this.config.commands.forEach(cmd => {
      var fullPath = path.join('../commands', cmd, 'cmd.js');
      var script = require(fullPath);

      this.commands[cmd] = script;
    });


    this.logger.info('Connecting...');
    this.client.login(this.token);

    this.logger.info('Setting up events...');
    this.client
      .on('ready', this.onReady())
      .on('message', this.onMessage())
      .on('error', this.onError());
  }
}

module.exports = Bot;