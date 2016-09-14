const TelegramBot = require('node-telegram-bot-api');

var token = process.argv.slice(2);

if (token.length > 0) {
  var bot = new TelegramBot(token, {polling: true});
  bot.onText(/\/echo (.+)/, function (msg, match) {
    var fromId = msg.from.id;
    var resp = match[1];
    bot.sendMessage(fromId, resp);
    console.log(resp);
    console.log("test");
  });
} else {
  console.log("Usage: \"node index.js BOTTOKENHERE\"");
  process.exit(1);
}