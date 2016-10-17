// grabs info from keys.js
var tweetKeys = require("./keys");

// gets all of the twitter keys from the keys.js file
var keyList = tweetKeys.twitterKeys;

// loop through key list and print out details
for (var key in keyList) {
	console.log(key + ": " + keyList[key]);
}