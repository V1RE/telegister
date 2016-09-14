const TelegramBot = require('node-telegram-bot-api');

var token = '297689787:AAGrd7zrK2oJWCOrieyUqpqelLjXoDvVS9w';
var bot = new TelegramBot(token, {polling: true});

bot.onText(/\/echo (.+)/, function (msg, match) {
  var fromId = msg.from.id;
  var resp = match[1];
  bot.sendMessage(fromId, resp);
  console.log(resp);
  console.log("test");
});