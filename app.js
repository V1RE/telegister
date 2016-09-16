const Emoji = require('node-emoji').emoji;
const Magister = require('magister.js');
const Moment = require('moment');
const Request = require('request');
const TelegramBot = require('node-telegram-bot-api');

function mainbot (token) {
  bot = new TelegramBot(token, {polling: true});
  bot.onText(/\/start/, function (msg) {
    var userobj = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
    var fromId = msg.from.id;
    var newuser = true;
    
    for (i = 0; i < userobj.users.length; i++){
      if (userobj.users[i].id == fromId) {
        newuser = false;
      }
    }
    
    if (newuser == true){
      bot.sendMessage(fromId, "Hello there " + msg.from.first_name + " " + Emoji.smile);
      userobj.users.push({"id": fromId});
      fs.writeFileSync('./users.json', JSON.stringify(userobj, null, 2), 'utf-8');
    } else {
      bot.sendMessage(fromId, "Your account has already been initialised. " + Emoji.thumbsup);
    }
  });
  
  bot.onText(/\/setschool ([a-z]+)/, function (msg, match) {
    var resp = match[1];
    Request('https://' + resp + '.magister.net', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var userobj = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
        var curuser = userobj.users.filter(function (item) {
          return item.id === msg.from.id;
        });
        curuser[0].prefix = resp;
        fs.writeFileSync('./users.json', JSON.stringify(userobj, null, 2), 'utf-8');
      } else {
        bot.sendMessage(msg.from.id, Emoji.warning + "School prefix \"" + match[1] + "\" responded with an error...");
//        TODO: add better explanation
      }
    });
  });
  
  bot.onText(/\/setuser ([a-zA-Z0-9]+)/, function (msg, match) {
    var resp = match[1];
    var userobj = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
    var curuser = userobj.users.filter(function (item) {
      return item.id === msg.from.id;
    });
    curuser[0].uname = resp;
    fs.writeFileSync('./users.json', JSON.stringify(userobj, null, 2), 'utf-8');
  });
  
  bot.onText(/\/setpass (.+)/, function (msg, match) {
    var resp = match[1];
    var userobj = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
    var curuser = userobj.users.filter(function (item) {
      return item.id === msg.from.id;
    });
    curuser[0].pword = resp;
    fs.writeFileSync('./users.json', JSON.stringify(userobj,null, 2), 'utf-8');
  });
  
//  bot.onText(/\/help/, function (msg, match) {
//    
//  })
}