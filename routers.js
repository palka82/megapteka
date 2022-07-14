"use strict";

const express = require("express");
const Web = require("./controllers/web");
const router = express.Router();

router.all("/", (req, res) => {
    res.status(400).send('Bad Request');
});
//Товары
router.get("/product", Web.ProductsList);
router.post("/product", Web.ProductAdd);
router.delete("/product/:id", Web.ProductDel);
router.put("/product", Web.ProductUpdate);
router.get("/product/:id", Web.ProductGet);
//Группы
router.get("/groups", Web.GroupsList);
router.post("/groups", Web.GroupAdd);
router.delete("/groups/:id", Web.GroupDel);
router.get("/groups/:id", Web.GroupGet);
router.put("/groups", Web.GroupUpdate);
module.exports = router;