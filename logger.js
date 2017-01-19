const Winston = require('winston');

class Logger {
  constructor () {
    Winston.remove(Winston.transports.Console);
    Winston.add(Winston.transports.Console, {
      colorize: true
    });

    return Winston;
	}
}

module.exports = Logger;