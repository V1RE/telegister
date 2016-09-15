const Emoji = require('node-emoji').emoji;
const Fs = require('fs');
const Magister = require('magister.js');
const Moment = require('moment');
const Request = require('request');
const TelegramBot = require('node-telegram-bot-api');

var userobj = JSON.parse(Fs.readFileSync('./users.json', 'utf-8'));

function mainbot (token) {
  bot = new TelegramBot(token, {polling: true});
  bot.onText(/\/start/, function (msg) {
    var userobj = JSON.parse(Fs.readFileSync('./users.json', 'utf-8'));
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
      updateUsers();
    } else {
      bot.sendMessage(fromId, "Your account has already been initialised. " + Emoji.thumbsup);
    }
    
//    new Magister.Magister({
//      school: 'xxxx',
//      username: 'xxxx',
//      password: 'xxxx'
//    }).ready(function () {
//      this.appointments(new Date(), function (error, result) {
//      console.log(result[0].teachers()[0].fullName());
//      });
//    });
  });
  
  bot.onText(/\/setschool ([a-z]+)/, function (msg, match) {
    var resp = match[1];
    Request('https://' + resp + '.magister.net', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var curuser = getCurrentUser(msg.from.id);
        curuser[0].prefix = resp;
        updateUsers();
      } else {
        bot.sendMessage(msg.from.id, Emoji.warning + "School prefix \"" + match[1] + "\" responded with an error...");
//        TODO: add better explanation
      }
    });
  });
  
//  bot.onText(/\/setuser ([a-zA-Z0-9]+)/, function (msg, match) {
//    var resp = match[1];
//    var curuser = getCurrentUser(msg.from.id);
//  })
}

function getCurrentUser (uid) {
  userobj = JSON.parse(Fs.readFileSync('./users.json', 'utf-8'));
  var curuser = userobj.users.filter(function (item) {
    return item.id === uid;
  });
  return curuser;
}

function updateUsers () {
  Fs.writeFileSync('./users.json', JSON.stringify(userobj, null, 2), 'utf-8');
}