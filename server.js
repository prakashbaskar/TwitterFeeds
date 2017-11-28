var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors')
var path = require('path')
var request = require('request');
var twitterFeed1 = require("./data/feed1.json");
var twitterFeed2 = require("./data/feed2.json");

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'style')));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/view/index.html');
});

app.get('/getTweets', function (req, res) {
	var twitterApiUrl_1 = "https://api.twitter.com/1.1/search/tweets.json?oauth_consumer_key=tHwjzqVARCMJxNh24TniCm9vT&oauth_token=935322602314321921-sN57l6I7bjLjWWolGhQwLguaYPk6kaA&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1511843223&oauth_nonce=L0hyit&oauth_version=1.0&oauth_signature=byia7lvQ95G77kFiBDJGGVWvaOY%3D&q=realDonaldTrump&result_type=mixed&count=10";
	var twitterApiUrl_2 = "https://api.twitter.com/1.1/search/tweets.json?oauth_consumer_key=tHwjzqVARCMJxNh24TniCm9vT&oauth_token=935322602314321921-sN57l6I7bjLjWWolGhQwLguaYPk6kaA&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1511843317&oauth_nonce=DrCH0y&oauth_version=1.0&oauth_signature=2X4aUaD25zD8YyYRGxwknz8qP4c%3D&q=BarackObama&result_type=mixed&count=10";
	
	// Request Feeds for 1st User
	request(twitterApiUrl_1, function (error, response, body) {
		var twitterResponse1 = {};
		if (!error && response.statusCode == 200) {
			twitterResponse1 = JSON.parse(body);
		} else {
			// If call to Twitter API fails, get data from backup .json file
			twitterResponse1 = twitterFeed1;
			console.log(`Unable to call Twitter Feed1 Error: ${error}`);
		}
		var tweets = twitterResponse1.statuses.map((item) => {
			return {"id": item.id, "text": item.text, "created_at": item.created_at, "user": "DonaldTrump"};
		})
		
		// Request Feeds for 2nd User
		request(twitterApiUrl_2, function (error2, response2, body2) {
			var twitterResponse2 = {}	
			if (!error2 && response2.statusCode == 200) {
				twitterResponse2 = JSON.parse(body2);
			  } else {
					// If call to Twitter API fails, get data from backup .json file
					twitterResponse2 = twitterFeed2;
					console.log(`Unable to call Twitter Feed2 Error: ${error2}`);
				}
				var tweets2 = twitterResponse2.statuses.map((item) => {
					return {"id": item.id, "text": item.text, "created_at": item.created_at, "user": "BarackObama"};
				})
				tweets = tweets.concat(tweets2);
				res.status(200).json(tweets);
		})
	})
})

var server = app.listen(9000, 'localhost', function () {
  var host = server.address().address
  var port = server.address().port
  console.log('App Server running at http://%s:%s', host, port);
});
