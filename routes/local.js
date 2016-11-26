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
                var nome, bairro, logradouro, numero, cep,
                    complemento, latitude, longitude;
                nome = req.body.data.nome;
                bairro = req.body.data.bairro;
                logradouro = req.body.data.logradouro;
                numero = req.body.data.numero;
                cep = req.body.data.cep;
                complemento = req.body.data.complemento;
                latitude = req.body.data.latitude;
                longitude = req.body.data.longitude;

                if(!nome || !bairro || !logradouro || !numero
                    || !latitude || !longitude) {
                    console.log('Incorrect params.');
                    res.json(400);
                    return;
                }
            }

            /* Conexão com o DB */
            var client = new pg.Client('postgres://postgres:lucas@localhost:5432/hackathon');
            client.connect(function (err) {
                if (err) throw err;

                var params = [nome, bairro, logradouro, numero, cep, complemento, latitude, longitude]

                // Execute a query on our database
                client.query(fs.readFileSync('../database/query/cria_local.sql', 'utf8'), params, function (err, result) {
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
                client.query(fs.readFileSync('../database/query/get_local.sql', 'utf8'), params, function (err, result) {
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
