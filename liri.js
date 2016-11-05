// grabs info from keys.js
var keys = require("./keys.js");

// twitter npm package
var twitter = require("twitter");

// spotify npm package
var spotify = require("spotify");

// request npm package
var request = require("request");

// fs package for read/write
var fs = require("fs");

// *\*\*\*\ FUNCTIONS */*/*/*/

// writes to the log.txt file
var callHemmingway = function(data){
	fs.appendFile("log.txt", "\r\n\r\n");

	fs.appendFile("log.txt", JSON.stringify(data), function(err){
		if (err){
			return console.log(err);
		}

		console.log("log.txt was UPDATED!");
	});
};

// helper function that gets the artist name
var getArtistNames = function(artist){
	return artist.name;
};

// node liri.js my-tweets
// will show last 20 tweets and when they were created
var showMeMyTweets = function(){
	var client = new twitter(keys.twitterKeys);

	var params = { screen_name: "TonieMarie2"};
	client.get("statuses/user_timeline", params, function(error, tweets, response){
		if (!error){
			var data = [];

			for (var i = 0; i < tweets.length; i++) {
				data.push({
					created_at: tweets[i].created_at,
					text: tweets[i].text
				});
			}

			console.log(data);
			callHemmingway(data);
		}
	});
};

// node liri.js spotify-this-song '<song name here>'
// will show the ARTIST(S), SONG'S NAME, PREVIEW LINK OF SONG FROM SPOTIFY, ALBUM SONG IS FROM
var nameThatTune = function(songName){
	if (songName === undefined){
		songName = "Sadness Monster";
	}

	spotify.search({ type: "track", query: songName }, function(err, data){
		if (err){
			console.log("Error occurred: " + err);
			return;
		}

		var songs = data.tracks.items;
		var data = [];

		for (var i = 0; i < songs.length; i++) {
			data.push({
				"artist(s)": songs[i].artists.map(getArtistNames),
				"song name: ": songs[i].name,
				"preview song: ": songs[i].preview_url,
				"album: ": songs[i].album.name
			});
		}

		console.log(data);
		callHemmingway(data);
	});
};

// node liri.js movie-this '<movie name here>'
// will show TITLE, RELEASE YEAR, IMDB RATING, COUNTRY, LANGUAGE, PLOT, ACTORS, ROTTEN TOMATOES RATING AND URL
var netflixAndChill = function(movieName){
	if (movieName === undefined) {
		movieName = "Mr Nobody";
	}

	var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&r=json";

	request(urlHit, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var jsonData = JSON.parse(body);
			var data = {
				"Title:": jsonData.Title,
				"Year:": jsonData.Year,
				"Rated:": jsonData.Rated,
				"IMDB Rating:": jsonData.imdbRating,
				"Country:": jsonData.Country,
				"Language:": jsonData.Language,
				"Plot:": jsonData.Plot,
				"Actors:": jsonData.Actors,
				"Rotten Tomatoes Rating:": jsonData.tomatoRating,
				"Rotton Tomatoes URL:": jsonData.tomatoURL
			};

			console.log(data);
			callHemmingway(data);
		}
	});
};

//node liri.js do-what-it-says
// using the fs node package, liri will take the text inside of random.txt and then use it to call one of liri's commands
var doWhatISay = function(){
	fs.readFile("random.txt", "utf8", function(error, data){
		console.log(data);

		var dataArray = data.split(",");

		if (dataArray.length === 2){
			pick(dataArray[0], dataArray[1]);
		}
		else if (dataArray.length === 1){
			pick(dataArray[0]);
		}
	});
};

// function for determining which command is executed
var eenyMeenyMinyMoe = function(caseData, functionData){
	switch (caseData){
		case "my-tweets":
			showMeMyTweets();
			break;
		case "spotify-this-song":
			nameThatTune(functionData);
			break;
		case "movie-this":
			netflixAndChill(functionData);
			return;
		case "do-what-it-says":
			doWhatISay();
			break;
		default:
			console.log("Liri isn't THAT smart, c'mon now...");
	}
};

// function which takes in command line arguments and executes correct function accordingly
var runDMC = function(argOne, argTwo){
	eenyMeenyMinyMoe(argOne, argTwo);
};

// MAIN PROCESS
runDMC(process.argv[2], process.argv[3]);