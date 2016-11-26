var config = module.exports = {};

config.hostname = "localhost:3000";

config.db_config = {
    user: 'cristian',
    password: 'oioioi',
    database: 'seek7',
    host: 'localhost',
    port: 5432
};

config.db_connection = 'postgres://' + config.db_config.user + ':' + config.db_config.password + '@' +
                       config.db_config.host + ':' + config.db_config.port + '/' + config.db_config.database;