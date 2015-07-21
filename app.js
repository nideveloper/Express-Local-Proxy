var express = require('express');
var nconf = require('nconf');
var app = express();

nconf.argv()
       .env()
       .file({ file: 'config.json' });

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
    var request = require('request');
    request('http://nideveloper.co.uk/api', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(body);
      }
    })
});

app.get('/api/*', function (req, res) {
    var request = require('request');
    var r = request.defaults({ 'proxy': nconf.get('PROXY') });

    console.log("Calling URL " + req.url);
    r.get('http://nideveloper.co.uk' + req.url).pipe(res);
});

app.get('/twitter/nideveloper', function (req, res) {
    var Twitter = require('twitter');

    var client = new Twitter({
        consumer_key: nconf.get('TWITTER_CONSUMER_KEY'),
        consumer_secret: nconf.get('TWITTER_CONSUMER_SECRET'),
        access_token_key: nconf.get('TWITTER_ACCESS_TOKEN_KEY'),
        access_token_secret: nconf.get('TWITTER_ACCESS_TOKEN_SECRET'),
        request_options: {
            proxy: nconf.get('PROXY')
        }
    });

    console.log("Loading NI Developer Tweets");

    var params = { screen_name: 'nideveloper', count: 5 };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            res.json(tweets);
        } else {
            console.log(error)
        }
    });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Proxy listening at http://%s:%s', host, port);
});