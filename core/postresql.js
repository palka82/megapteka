const Sequelize = require("sequelize");

class Postgresql {
    constructor(host, database, user, pass, loggingSQL = false) {
        let options = {};
        if (loggingSQL) {
            options = {
                host: host,
                dialect: "postgres",
                logging: console.log,
                pool: {
                    max: 20,
                    min: 5,
                    idle: 2 * 60 * 1000
                }
            }
        } else {
            options = {
                host: host,
                dialect: "postgres",
                logging: "",
                pool: {
                    max: 20,
                    min: 5,
                    idle: 2 * 60 * 1000
                }
            }
        }
        return new Sequelize(database, user, pass, options)
    }
}

module.exports = Postgresql;