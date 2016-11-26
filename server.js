#!/usr/bin/env node

var port = 3000;
var express = require('express');
var serveStatic = require('serve-static');
var config = require('./config.js');
var bodyParser = require('body-parser');
var app = express();

var isLogged = require('connect-ensure-login').ensureLoggedIn();

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(db.establish(config.db_config));

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));

app.listen(port, function() {
    console.log('Server listening on port ' + port + '.');
});

var news = require('./routes/news.js')();
var users = require('./routes/users.js')();
var item = require('./routes/item.js')();
// var news = require('./routes/news.js')(params);


app.post('/item', item.post);



app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
