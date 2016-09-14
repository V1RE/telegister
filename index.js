const fs = require('fs');

eval(fs.readFileSync('app.js').toString());

var token = process.argv.slice(2);

if (token.length > 0) {
  mainbot(token)
} else {
  console.log("Usage: \"node index.js BOTTOKENHERE\"");
  process.exit(1);
}