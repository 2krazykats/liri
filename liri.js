var twitKey = require("./keys.js");
var spotifyKey = require("./spotify.key");
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

	var songName = '' ;

function spotifyCall(song) {

	var getSpotifySong = new spotify(spotifyKey);

	if (!process.argv[3]) {
		songName = "The Sign";
	} else {
		for (var i=3; i<process.argv.length; i++) {
		 songName += process.argv[i] + ' ';
		}
	}
	getSpotifySong.search({
			type: 'track',
			query: songName
		}).then(function(response) {    
			var jsonBody = JSON.stringify(response,null, 2);
			// console.log(jsonBody);
			var body = JSON.parse(jsonBody);
			// console.log(body);

//	So the instructions are not clear on whether we need to print out all the albums.
	// I am choosing to print all retruned items
			for (var i = 0; i < body.tracks.items.length; i++) {
				console.log(`*********** record #${i} ***********`);
				console.log(`Title: ${body.tracks.items[i].name}`);
				console.log(`Album: ${body.tracks.items[i].album.name}`);

				// There can be an array of artists
				for (var j = 0; j < body.tracks.items[i].artists.length; j++) {
					console.log(`Artist(s): ${body.tracks.items[i].artists[j].name}`);
				}
				console.log(`Preview URL: ${body.tracks.items[i].preview_url}`);
				console.log("\n");
			}
		}).catch(function(err) {
			console.log(err);
		})

	// getSpotifySong.search({
	// 	type: 'track',
	// 	query: songName
	// }, function(error, data) {
	// 	console.log(callSpotify.search(type: "track", query: "The Sign"));
	// 	if(error) {
	// 		return console.log('Error occurred: ' + error);
	// } else {
	// 	var spotifyJson = JSON.parse(body);
	// 	console.log(spotifyJson);
	// 	}
	// });

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
			console.log(`Rotten Tomatoes Rating: ${findRTValue(jsonBody)}`);
			console.log(`Country(s): ${jsonBody.Country}`);
			console.log(`Language: ${jsonBody.Language}`);
			console.log(`Plot: ${jsonBody.Plot}`);
			console.log(`Actors: ${jsonBody.Actors}`);
		}
	});
}

// Search thru the JSON array and find the Rotten Tomatoes rating
function findRTValue(jsonBody) {
	for (var i = 0; i < 3; i++) {
		if (jsonBody.Ratings[i].Source === "Rotten Tomatoes") {
			return jsonBody.Ratings[i].Value;
		}
	}
}


// Set up the function for do-what-it-says

function fsCall() {

	fs.readFile("random.txt", "utf8", function(error, data) {
		if(!error) {
			var parseData = data.split(",");
			console.log(parseData);
			action = parseData[0];
			spotifyCall(parseData[1]);
		} else console.log(error); 
	});
}

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