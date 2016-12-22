var express = require('express');
var nconf = require('nconf');
var mysql = require('mysql');
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
    res.send("This is a proxy for the NIDeveloper API");
});

app.get('/api/*', function (req, res) {
    var request = require('request');
    var r = request.defaults({ 'proxy': nconf.get('PROXY') });

    console.log("Calling URL " + req.url);
    r.get('http://nideveloper.co.uk' + req.url).pipe(res);
});

function getDBConnectionProperties() {
    var properties = {
    host: nconf.get('SQL_HOST'),
    user: nconf.get('SQL_USER'),
    password: nconf.get('SQL_PASSWORD'),
    database : nconf.get('SQL_DATABASE')
    };

    return properties;
}

app.get('/v2/api/posts', function (req, res) {
    var connection = mysql.createConnection(getDBConnectionProperties());
    connection.connect();
    connection.query(nconf.get('SQL_LATEST_POSTS'), function (err, rows, fields) {
        if (err){
            throw err
        }

        res.json(rows);
    });

    connection.end();
});

app.get('/v2/api/posts/:id', function (req, res) {
    var id = req.params.id;
    var connection = mysql.createConnection(getDBConnectionProperties());
    connection.connect();
    connection.query(nconf.get('SQL_SPECIFIC_POST_BY_ID'), id,  function (err, rows, fields) {
        if (err){
            throw err
        }
        console.log(rows);
        for (var i in rows) {
            rows[i].content = rows[i].content.toString('utf-8');

        }
        res.json(rows);
    });

    connection.end();
});

app.get('/v2/api/categories', function (req, res) {
    var connection = mysql.createConnection(getDBConnectionProperties());
    connection.connect();
    connection.query(nconf.get('SQL_ALL_CATEGORIES'), function (err, rows, fields) {
        if (err){
            throw err
        }

        res.json(rows);
    });

    connection.end();
});

app.get('/v2/api/categories/:id', function (req, res) {
    var id = req.params.id;
    var connection = mysql.createConnection(getDBConnectionProperties());
    connection.connect();
    connection.query(nconf.get('SQL_SPECIFIC_CATEGORY_BY_ID'), id, function (err, rows, fields) {
        if (err){
            throw err
        }

        res.json(rows);
    });

    connection.end();
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

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Proxy listening at http://%s:%s', host, port);
});