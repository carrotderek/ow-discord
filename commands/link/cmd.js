const fs = require('fs');
const path = require('path');

module.exports = {
  run: (client, message, args) => {

    if (message.author.bot) { return; }

    let filePath = path.join('commands', 'battletags.json');
    let battletags = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(battletags);
    if (!battletags[message.author.id]) {
      battletags[message.author.id] = {};
    }

    let userData = battletags[message.author.id];

    userData.battletag = args;

    console.log(userData);
    console.log(battletags);
    console.log(JSON.stringify(battletags));

    fs.writeFile(
      filePath,
      JSON.stringify(battletags)
    );

    message.channel.sendMessage(`${message.author}: Successfully linked your Discord account to B.net battletag: ${args}`);
  }
};