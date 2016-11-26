var fs = require('fs');
var pg = require('pg');
var config = require('../config.js');

module.exports = function () {
    return {
        post : function (req, res) {
            if(!req.body || !req.body.data) {
                console.log('No params received.');
                res.json(400);
                return;
            } else {
                var nome, unidade, sigla;
                nome = req.body.data.nome;
                unidade = req.body.data.unidade;
                sigla = req.body.data.sigla;

                if(!nome || !unidade || !sigla) {
                    console.log('Incorrect params: ' + nome + '; ' + unidade + '; ' + sigla + '.');
                    res.json(400);
                    return;
                }
            }

            /* Conexão com o DB */
            var client = new pg.Client('postgres://hackathon:123mudar@localhost:5432/hackathon');
            client.connect(function (err) {
                if (err) throw err;

                var params = [ nome, unidade ,sigla];

                // Execute a query on our database
                    client.query(fs.readFileSync('./database/query/cria_produto.sql', 'utf8'), params, function (err, result) {
                        if (err) throw err;

                        // Disconnect the client
                        client.end(function (err) {
                            if (err) throw err;
                        });

                        res.json(result.rows);
                    });
                });

            },
            get : function (req, res) {
                if(!req.body || !req.body.data) {
                    console.log('No params received.');
                    res.json(400);
                    return;
                } else {
                    var nome;
                    nome = req.body.data.nome;

                    if(!nome) {
                        console.log('Incorrect params.');
                        res.json(400);
                        return;
                    }
                }

                /* Conexão com o DB */
                var client = new pg.Client('postgres://postgres:lucas@localhost:5432/hackathon');
                client.connect(function (err) {
                if (err) throw err;

                var params = [ nome ];

                // Execute a query on our database
                client.query(fs.readFileSync('../database/query/get_produto.sql', 'utf8'), params, function (err, result) {
                    if (err) throw err;

                    // Disconnect the client
                    client.end(function (err) {
                        if (err) throw err;
                    });

                    res.json(result.rows);
                });
            });
        }
    }
};
