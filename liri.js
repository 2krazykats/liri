var twitKey = require("./keys.js");
var twitter = require("twitter");
var spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");
var action = process.argv[2];


// Set up the function for the Twitter API
function twitterCall() {

		var newTwitKey = new twitter(twitKey);

		var command = process.argv[2];
		var params = {screen_name: 'entitledcats',
						count: 20};

			newTwitKey.get("statuses/user_timeline", params, function(error, tweets, response) {
				if(error) throw error;
				// console.log(JSON.stringify(tweets, null, 2));
				for (var i = 0; i < tweets.length; i++) {
					console.log("============================");
					console.log(tweets[i].text);
				}
		});
	}

// Set up the function for the Spotify API
var songName = process.argv[3];

function spotifyCall() {
	var callSpotify = new spotify ({
		id: '5eae46c9dd2e42dc8487202017259cbc',
		secret: '13f77f281d1f4cdd9acfe9e4a1c64b8d'
	});

callSpotify.search({
	type: 'artist OR album OR track',
	query: 'nothing'
}, function(error, data) {
	if(error) {
		return console.log('Error occurred: ' + error);
	}
})

}



// Set up the function for the OMDB API
function omdbCall() {

	var movieTitle = '' ;

	if (!process.argv[3]) {
		movieTitle = "Mr.,Nobody";
	} else {
		for (var i=3; i<process.argv.length; i++) {
		 movieTitle += process.argv[i] + ',';
		}
	}

	var queryUrl = "http://www.omdbapi.com/?t="+movieTitle+"&y=&plot=short&apikey=40e9cece";
	// console.log(queryUrl);

	request(queryUrl, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var jsonBody = JSON.parse(body);
			// console.log(jsonBody);

			var prettyTitle = movieTitle.split(",").join(" ");

			console.log("-------------------------------------------------");
			console.log(`Movie: ${prettyTitle}`);
			console.log(`Release date is: ${jsonBody.Released}`);
			console.log(`Rating: ${jsonBody.Rated}`);
			// console.log(`Rotten Tomatoes Rating: ${jsonBody.Ratings[1].Value}`);
			console.log(`Rotten Tomatoes Rating: ${findRTValue(jsonBody)}`);
			console.log(`Country(s): ${jsonBody.Country}`);
			console.log(`Language: ${jsonBody.Language}`);
			console.log(`Plot: ${jsonBody.Plot}`);
			console.log(`Actors: ${jsonBody.Actors}`);
		}
	});
}

function findRTValue(jsonBody) {
	for (var i = 0; i < 3; i++) {
		if (jsonBody.Ratings[i].Source === "Rotten Tomatoes") {
			return jsonBody.Ratings[i].Value;
		}
	}
}

// Set up the function for do-what-it-says







// Main processing

switch (action) {
	case "my-tweets":
		twitterCall();
		break;

	case "spotify-this-song":
		spotifyCall();
		break;

	case "movie-this":
		omdbCall();
		break;

	case "do-what-this-says":
		fsCall();
		break;
}