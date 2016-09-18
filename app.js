const Emoji = require('node-emoji').emoji;
const Request = require('request');
const TelegramBot = require('node-telegram-bot-api');

eval(fs.readFileSync('telegister.js').toString());

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
      var curuser = userobj.users.filter(function (item) {
        return item.id === fromId;
      });
      curuser[0].firstname = msg.from.first_name;
      curuser[0].lastname = msg.from.last_name;
      fs.writeFileSync('./users.json', JSON.stringify(userobj, null, 2), 'utf-8');
    } else {
      bot.sendMessage(fromId, "Your account has already been initialised. " + Emoji.thumbsup);
    }
  });
  
  bot.onText(/\/setschool ([a-z ]+)/, function (msg, match) {
    var resp = match[1];
		Request('https://mijn.magister.net/api/schools?filter=' + resp, function (error, response, body) {
			if (!error && response.statusCode == 200 && body != '[]') {
				var userobj = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
				var curuser = userobj.users.filter(function (item) {
          return item.id === msg.from.id;
        });
				curuser[0].prefix = JSON.parse(body)[0].Url.replace('https://', '').replace('.magister.net', '');
				fs.writeFileSync('./users.json', JSON.stringify(userobj, null, 2), 'utf-8');
				bot.sendMessage(msg.from.id, Emoji.bell + " School prefix: " + curuser[0].prefix);
			} else {
				bot.sendMessage(msg.from.id, Emoji.warning + " " + match[1] + " doesn't seem to exist...\nPlease try again.");
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
    bot.sendMessage(msg.from.id, Emoji.bell + " Username: " + curuser[0].uname);
  });
  
  bot.onText(/\/setpass (.+)/, function (msg, match) {
    var resp = match[1];
    var userobj = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
    var curuser = userobj.users.filter(function (item) {
      return item.id === msg.from.id;
    });
    curuser[0].pword = resp;
    fs.writeFileSync('./users.json', JSON.stringify(userobj, null, 2), 'utf-8');
    bot.sendMessage(msg.from.id, Emoji.bell + " Password: " + curuser[0].pword);
  });
  
  bot.onText(/\/help/, function (msg, match) {
    bot.sendMessage(msg.from.id, "Help menu");
//    TODO: add help menu
  });
  
  bot.onText(/\/schedule/, function (msg, match) {
    getRooster(msg, bot);
  });
}