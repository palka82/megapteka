"use strict";

const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const Storage = require("./core/storage");
const router = require("./routers");
require("dotenv").config();

const PORT = process.env.NODE_PORT || 8085;

function requestLog(req, res, next) {
    console.log(`${new Date().toISOString()} | ${req.method} | ${req.url} | ${req.headers['x-forwarded-for'] || req.socket.remoteAddress} | ${res.statusCode} `);
    next();
}

(async () => {
    try {
        console.log(`${new Date().toISOString()} | Starting...`);
        await Storage._dbConn.authenticate();
        console.log(`${new Date().toISOString()} | Connection to DB has been established successfully.`);
        await Storage._dbConn.sync({force: true});

        app.use(requestLog);
        app.use(bodyParser.json());
        app.use("/", router);
        app.listen(PORT, () => {
            console.log(`${new Date().toISOString()} | App running on port ${PORT}.`)
        })
    } catch (e) {
        console.log(`${new Date().toISOString()} | ${e.stack}`);
        process.exit();
    }
})();