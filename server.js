#!/usr/bin/env node

var port = 3000;
var express = require('express');
var serveStatic = require('serve-static');
var config = require('./config.js');
var bodyParser = require('body-parser');
var app = express();
var passport = require('passport');
var isLogged = require('connect-ensure-login').ensureLoggedIn();

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(port, function() {
    console.log('Server listening on port ' + port + '.');
});

app.get('/product', function(req, res) {
	console.log(req);
	res.json({
	    arr: [
	        {
	            nome: 'Feijão 1'
	            , id_produto: 1
	            , registros: [
	                {
	                    estabelecimento: 'Mercado Tio Juca'
	                    , preco: 6.99
	                    , logradouro: 'Rua Emilio de Menezes'
	                    , numero: '232'
	                    , distancia: '10'
	                }, {
	                    estabelecimento: 'Bar no Trabalho'
	                    , preco: 7.99
	                    , logradouro: 'Rua Carlos Cavalcanti'
	                    , numero: '999'
	                    , distancia: '3.7'
	                }
	            ]
	        }, {
	            nome: 'Feijão Marca 2'
	            , id_produto: 2
	            , registros: [
	                {
	                    mercado: 'Oi'
	                    , preco: 7.25
	                }, {
	                    mercado: 'Mercado da Tia Dona'
	                    , preco: 8.50
	                }
	            ]
	        }
	]});
});

app.get('/kaio', function(req, res) {
	console.log(req);
})

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
