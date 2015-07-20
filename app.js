var express = require('express');
var app = express();

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

app.get('/categories', function (req, res) {
    var request = require('request');
    request('http://nideveloper.co.uk/api/categories', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(body);
      }
    })
});

app.get('/category/:categoryID', function (req, res) {
    var request = require('request');
    request('http://nideveloper.co.uk/api/category/'+req.params.categoryID, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(body);
      }
    })
});

app.get('/posts', function (req, res) {
    var request = require('request');
    request('http://nideveloper.co.uk/api/posts', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(body);
      }
    })
});

app.get('/post/:id', function (req, res) {
    var request = require('request');
    request('http://nideveloper.co.uk/api/post/'+req.params.id, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(body);
      }
    })
});

app.get('/search/:query', function (req, res) {
    var request = require('request');
    request('http://nideveloper.co.uk/api/search/'+req.params.query, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(body);
      }
    })
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Proxy listening at http://%s:%s', host, port);
});