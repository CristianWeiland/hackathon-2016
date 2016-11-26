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
                var username = req.body.data.user;
                var password = req.body.data.pass;

                if(!username || !password) {
                    console.log('Incorrect params.');
                    res.json(400);
                    return;
                }

                if(username === 'oioioi' && password === 'xD') {
                    console.log('Authenticated.');
                    res.json(200);
                    return;
                } else {
                    console.log('Not authenticated.');
                    res.json(400);
                    return;
                }
            }

            /* Conexão com o DB
            var client = new pg.Client('postgres://cristian:oioioi@localhost:5432/seek7');
            console.log(config.db_connection);
            client.connect(function (err) {
                if (err) throw err;

                // Execute a query on our database
                client.query('SELECT * FROM users', function (err, result) {
                    if (err) throw err;

                    console.log(result.rows[0]);

                    // Disconnect the client
                    client.end(function (err) {
                        if (err) throw err;
                    });

                    res.json(result.rows);
                });
            });
            */
        },
        get : function (req, res) {
            console.log('Loading...');
            res.json(400);
        }
    }
};
