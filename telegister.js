const Magister = require('magister.js');
const Moment = require('moment');

function getSchedule (msg, bot) {
  var userobj = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
  var curuser = userobj.users.filter(function (item) {
    return item.id === msg.from.id;
  });
  var school = curuser[0].prefix;
  var username = curuser[0].uname;
  var password = curuser[0].pword;
  new Magister.Magister({
    school: school,
    username: username,
    password: password
  }).ready(function (inlogerror) {
    if (!inlogerror) {
      this.appointments(new Date(), function (error, result) {
        if (!error) {
          var fullmsg = Emoji.smiley + " Hello " + curuser[0].firstname + ", here's your schedule for today:\n\n";
          for (i = 0; i < result.length; i++) {
            fullmsg += result[i].beginBySchoolHour() + " (" + Moment(result[i].begin()).format("HH:mm") + " - " + Moment(result[i].end()).format("HH:mm") + ")   " + result[i].location() + " " + result[i].classes()[0] + " " +  result[i].teachers()[0].fullName() + "\n";
          }
          bot.sendMessage(curuser[0].id, fullmsg);
        } else {
          bot.sendMessage(curuser[0].id, Emoji.warning + " We have an error " + Emoji.warning + "\n" + error);
        }
      });
    } else {
      bot.sendMessage(curuser[0].id, Emoji.warning + " We have an error:\n\n" + inlogerror);
    }
  });
}

function getHomework (msg, bot) {
  var userobj = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
  var curuser = userobj.users.filter(function (item) {
    return item.id === msg.from.id;
  });
  var school = curuser[0].prefix;
  var username = curuser[0].uname;
  var password = curuser[0].pword;
  
  new Magister.Magister({
    school: school,
    username: username,
    password: password
  }).ready(function(inlogerror){
    if (!inlogerror) {
      this.appointments(new Date(), function (error, result) {
        if (!error) {
          var fullmsg = Emoji.smiley + " Hello " + curuser[0].firstname + ", here's your homework for today:\n\n";
          var counter = 0;
          for (i = 0; i < result.length; i++) {
            if (result[i].content() != "") {
              counter++;
              fullmsg += counter + ". " + result[i].classes()[0] + ": " + result[i].content() + "\n";
            }
          }
          bot.sendMessage(curuser[0].id, fullmsg);
        } else {
          bot.sendMessage(curuser[0].id, Emoji.warning + Emoji.warning + " We have an error:\n\n" + error);
        }
      });
    } else {
      bot.sendMessage(curuser[0].id, Emoji.warning + " We have an error:\n\n" + inlogerror);
    }
  })
}

function getGrades (msg, bot) {
  var userobj = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
  var curuser = userobj.users.filter(function (item) {
    return item.id === msg.from.id;
  });
  var school = curuser[0].prefix;
  var username = curuser[0].uname;
  var password = curuser[0].pword;
  
  new Magister.Magister({
    school: school,
    username: username,
    password: password
  }).ready(function (inlogerror) {
    if (!inlogerror) {
      this.currentCourse(function (error, result) {
				result.grades(function (error, result) {
          var fullmsg = Emoji.eight + " Hello " + curuser[0].firstname + ", here are your last 5 grades:\n\n";
          var counter = 0;
          for(i = 0; (i < result.filter(function (item){return item._type._type === 1;}).length) && (i < 5); i++){
            fullmsg += result.filter(function (item) {
                return item._type._type === 1;
            })[i]._grade;
          }
          bot.sendMessage(curuser[0].id, fullmsg);
				});
			});
    }
  });
}