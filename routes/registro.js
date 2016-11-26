var fs = require('fs');
var pg = require('pg');
var config = require('../config.js');

module.exports = function () {
    return {
        post : function (req, res) {
            /* Insert if register does not exists or update otherwise. */
            if(!req.body || !req.body.data) {
                console.log('No params received.');
                res.json(400);
                return;
            } else {
                var id_produto, id_local, preco, data, quantidade;

                if(!id_produto || !id_local || !preco || !data || !quantidade) {
                    console.log('Incorrect params.');
                    res.json(400);
                    return;
                }
            }

            /* Conexão com o DB */
            var client = new pg.Client('postgres://postgres:lucas@localhost:5432/hackathon');
            client.connect(function (err) {
                if (err) throw err;

                var params = [
                    id_produto
                    , id_local
                    , preco
                    , data
                    , quantidade
                ];

                // Execute a query on our database
                client.query(fs.readFileSync('../database/query/cria_produto.sql', 'utf8'), params, function (err, result) {
                    if (err) throw err;

                    if(result.rows.length > 0) {
                        // Entry found. Update it.
                        // Execute a query on our database
                        client.query(fs.readFileSync('../database/query/update_registro.sql', 'utf8'), params, function (err, result) {
                            if (err) throw err;

                            // Disconnect the client
                            client.end(function (err) {
                                if (err) throw err;
                            });

                            res.json(200);
                        });
                    } else {
                        // Entry not found. Insert it.
                        // Execute a query on our database
                        client.query(fs.readFileSync('../database/query/insere_registro.sql', 'utf8'), params, function (err, result) {
                            if (err) throw err;

                            // Disconnect the client
                            client.end(function (err) {
                                if (err) throw err;
                            });

                            res.json(200);
                        });
                    }
                });
            });
        }
    }
};
