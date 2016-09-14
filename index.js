const TelegramBot = require('node-telegram-bot-api');
const Magister = require('magister.js');
const Moment = require('moment');

var token = process.argv.slice(2);

if (token.length > 0) {
  bot = new TelegramBot(token, {polling: true});
  bot.onText(/\/echo (.+)/, function (msg, match) {
    var fromId = msg.from.id;
    var resp = match[1];
    bot.sendMessage(fromId, resp);
    console.log(resp);

    new Magister.Magister({
      school: 'xxxx',
      username: 'xxxx',
      password: 'xxxx'
    }).ready(function () {
      this.appointments(new Date(), function (error, result) {
      console.log(result[0].teachers()[0].fullName());
      });
    });
  });
} else {
  console.log("Usage: \"node index.js BOTTOKENHERE\"");
  process.exit(1);
}