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
			bot.sendMessage(fromId, "Welcome to \"TeleGister\"!\nTo get started, you first have to set up your account.\nLet's start by choosing your school!\nType \"\/setschool \<schoolname\>\"\nFor example: \"\/setschool cals college nieuwegein\"\n\n Now we'll set our username.\nType \"\/setuser \<magister-username\>\"\nFor example: \"\/setuser 116984\"\n\nFinally we'll put in our password.\nType \"\/setpass \<magister-password\>\"\nFor example: \"\/setpass nodbfs\"\n\nNow we have to hide your password, please delete our conversation and add me again (search @telegister_bot in telegram) and type /start again.");
    } else {
      bot.sendMessage(fromId, "Your account has already been initialised. " + Emoji.thumbsup + "\nTelegister has been setup.\nYou can see all the commands by typing \"\/help\".\nIf you get any errors, try setting your username and password again, if that doesn't fix it, use the command\n\"/bug <your problem in a few sentences>\"\nso Niels can help you fix the problem.");
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
				curuser[0].schoolname = JSON.parse(body)[0].Name;
				fs.writeFileSync('./users.json', JSON.stringify(userobj, null, 2), 'utf-8');
				bot.sendMessage(msg.from.id, Emoji.bell + " School name: " + curuser[0].schoolname);
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
    bot.sendMessage(msg.from.id, "Welcome to the help menu.\nHere is a list of commands and what they do:\n\/start  -  Initialise Telegister and show the welcome message.\n\/help  -  Shows this help menu.\n\/setschool <schoolname>  -  Sets your profiles school to the name you entered.\n\/setuser <magister-username>  -  Sets your username to the name you entered.\n\/setpass <magister-password>  -  Sets your password to what you entered.");
  });
  
  bot.onText(/\/schedule/, function (msg, match) {
    getSchedule(msg, bot);
  });
  
  bot.onText(/\/homework/, function (msg, match) {
    getHomework(msg, bot);
  });
	
	bot.onText(/\/finish/, function (msg, match) {
		//todo add finish
	});
	
	bot.onText(/\/grades/, function (msg, match) {
//		new Magister.Magister({
//			school: 'xxxx',
//			username: 'xxxx',
//			password: 'xxxx'
//		}).ready(function () {
//			this.currentCourse(function (error, result) {
//				result.grades(function (error, result) {
//					console.log(result.filter(function (item) {
//							return item._type._type === 1;
//					})[0]._grade);
//				});
//			});
//		});
	});
}