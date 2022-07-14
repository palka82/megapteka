const Sequelize = require("sequelize");
const path = require("path");

class Sqlite {
    constructor(options) {
        return new Sequelize({
            dialect: 'sqlite',
            storage: path.join(__dirname, options.storage),
            logging: options.loggingSQL,
        });
    }
}

module.exports = Sqlite;