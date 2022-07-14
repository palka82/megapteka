const Sequelize = require("sequelize");
const Postgresql = require("../core/postresql");
const Sqlite = require("../core/sqlite");
const dbConfig = require("../config");

class Storage {
    constructor(options = {}) {
        if (options.dialect === "pg") {
            this._dbConn = new Postgresql(options.host, options.database, options.user, options.pass, options.loggingSQL)
        }
        if (options.dialect === 'sqlite') {
            this._dbConn = new Sqlite(options);
        }
        //Описание табл. "Product"
        this.tableProducts = this._dbConn.define("product", {
            id: {
                allowNull: false,
                type: Sequelize.DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                comment: "Идентификатор"
            },
            description: {
                allowNull: false,
                type: Sequelize.DataTypes.STRING,
                defaultValue: '',
                comment: 'Описание'
            },
            name: {
                allowNull: false,
                type: Sequelize.DataTypes.STRING,
                defaultValue: '',
                comment: 'Наименование',
            },
            vendor: {
                allowNull: false,
                type: Sequelize.DataTypes.STRING,
                defaultValue: '',
                comment: "Производитель"
            }
        }, {
            timestamps: false
        });

        //Описание табл. "Groups"
        this.tableGroups = this._dbConn.define("group", {
            id: {
                allowNull: false,
                type: Sequelize.DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                comment: "Идентификатор"
            },
            name: {
                allowNull: false,
                type: Sequelize.DataTypes.STRING,
                defaultValue: '',
                unique: true,
                validate: {
                    notNull: true,
                    notEmpty: true
                },
                comment: 'Наименование',
            },
            parentId: {
                allowNull: false,
                type: Sequelize.DataTypes.BIGINT,
                defaultValue: 0,
                comment: "Идентификатор группы родителя"
            }
        }, {
            timestamps: false
        });

        this.tableGroupProduct = this._dbConn.define("group_product", {

        }, {
            timestamps: false
        });
        //Описание связей между таблицами
        this.tableProducts.belongsToMany(this.tableGroups, {through: this.tableGroupProduct, as: "groups"});
        this.tableGroups.belongsToMany(this.tableProducts, {through: this.tableGroupProduct, as: "products"});
    }
}

module.exports = new Storage({
        host: dbConfig.HOST,
        database: dbConfig.DB,
        user: dbConfig.USER,
        pass: dbConfig.PASSWORD,
        loggingSQL: false,
        dialect: "pg"
    }
);