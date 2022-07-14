const Product = require("./product");
const Groups = require("./groups");

function errorLog(res, e) {
    console.log(`${new Date().toISOString()} | ${e.stack}`);
    return res.status(500).send(JSON.stringify({error: e.message}))
}

class Web {
    static async ProductsList(req, res) {
        try {
            res.send(
                JSON.stringify(await Product.List())
            )
        } catch (e) {
            errorLog(res, e);
        }
    }

    static async ProductAdd(req, res) {
        try {
            if (!req.body.name) {
                return res.status(400).send(
                    JSON.stringify({
                        error: "Name not set!"
                    }));
            } else {
                if (req.body.name === "") {
                    return res.status(400).send(JSON.stringify({
                        error: "Name must not be empty!"
                    }));
                }
            }
            if (!req.body.description) {
                return res.status(400).send(JSON.stringify({
                    error: "Name not set!"
                }));
            } else {
                if (req.body.description === "") {
                    return res.status(400).send(JSON.stringify({
                        error: "Name must not be empty!"
                    }));
                }
            }
            if (!req.body.vendor) {
                return res.status(400).send(JSON.stringify({
                    error: "Name not set!"
                }));
            } else {
                if (req.body.vendor === "") {
                    return res.status(400).send(JSON.stringify({
                        error: "Name must not be empty!"
                    }));
                }
            }
            if (!req.body.groupsID) {
                return res.status(400).send(JSON.stringify({
                    error: "groupID not set!"
                }));
            }

            const name = req.body.name;
            const description = req.body.description;
            const vendor = req.body.vendor;
            const groupsID = req.body.groupsID;
            return res.send(JSON.stringify(await Product.Add(name, description, vendor, groupsID)));
        } catch (e) {
            errorLog(res, e);
        }
    }

    static async ProductDel(req, res) {
        try {
            if (!req.params.id) {
                return res.status(400).send(JSON.stringify({
                    error: "ID not set!"
                }));
            }
            const id = req.params.id;
            const product = await Product.Get(id);
            if (product !== null) {
                await Product.Del(id);
                return res.send("OK");
            } else {
                return res.status(404).send(JSON.stringify({
                    error: "Product not found!"
                }));
            }
        } catch (e) {
            errorLog(res, e);
        }
    }

    static async ProductUpdate(req, res) {
        try {
            if (!req.body.id) {
                return res.status(400).send(JSON.stringify({
                    error: "ID not set!"
                }));
            }
            if (!req.body.name) {
                return res.status(400).send(JSON.stringify({
                    error: "Name not set!"
                }));
            } else {
                if (req.body.name === "") {
                    return res.status(400).send(JSON.stringify({
                        error: "Name must not be empty!"
                    }));
                }
            }
            if (!req.body.description) {
                return res.status(400).send("Bad Request: Name not set!");
            } else {
                if (req.body.description === "") {
                    return res.status(400).send(JSON.stringify({
                        error: "Name must not be empty!"
                    }));
                }
            }
            if (!req.body.vendor) {
                return res.status(400).send(JSON.stringify({
                    error: "Name not set!"
                }));
            } else {
                if (req.body.vendor === "") {
                    return res.status(400).send(JSON.stringify({
                        error: "Name must not be empty!"
                    }));
                }
            }
            if (!req.body.groupsID) {
                return res.status(400).send(JSON.stringify({
                    error: "groupsID not set!"
                }));
            }
            const name = req.body.name;
            const description = req.body.description;
            const vendor = req.body.vendor;
            const groupsID = req.body.groupsID;
            const id = req.body.id;
            const product = await Product.Get(id);
            if (product === null) {
                return res.status(404).send(JSON.stringify({
                    error: "Product not found!"
                }));
            } else {
                await Product.Update(id, name, description, vendor, groupsID);
                return res.send(JSON.stringify(await Product.Get(id)));
            }
        } catch (e) {
            errorLog(res, e);
        }
    }

    static async ProductGet(req, res) {
        try {
            if (!req.params.id) {
                return res.status(400).send(JSON.stringify({
                    error: "ID not set!"
                }));
            }
            const id = req.params.id;
            const product = await Product.Get(id);
            if (product !== null) {
                return res.send(JSON.stringify(product));
            } else {
                return res.status(404).send(JSON.stringify({
                    error: "Product not found!"
                }));
            }
        } catch (e) {
            errorLog(res, e);
        }
    }

    static async GroupsList(req, res) {
        try {
            res.send(
                JSON.stringify(await Groups.List())
            );
        } catch (e) {
            errorLog(res, e);
        }
    }

    static async GroupAdd(req, res) {
        try {
            if (!req.body.name) {
                return res.status(400).send(JSON.stringify({
                    error: "Bad Request: Name not set!"
                }));
            } else {
                if (req.body.name === "") {
                    return res.status(400).send(JSON.stringify({
                        error: "Name must not be empty!"
                    }));
                }
            }

            const name = req.body.name;
            const parentID = req.body.parentID;

            const grp = await Groups.Add(name, parentID);
            return res.json(await Groups.Get(grp.id));
        } catch (e) {
            errorLog(res, e);
        }
    }

    static async GroupDel(req, res) {
        try {
            if (!req.params.id) {
                return res.status(400).send(JSON.stringify({
                    error: "ID not set!"
                }));
            }
            const id = req.params.id;
            const grp = await Groups.Get(id);
            if (grp !== null) {
                await Groups.Del(id);
                return res.send("OK");
            } else {
                return res.status(404).send(JSON.stringify({
                    error: "Group not found!"
                }));
            }
        } catch (e) {
            errorLog(res, e)
        }
    }

    static async GroupGet(req, res) {
        try {
            if (!req.params.id) {
                return res.status(400).send(JSON.stringify({
                    error: "ID not set!"
                }));
            }
            const id = req.params.id;
            const grp = await Groups.Get(id);
            if (grp !== null) {
                return res.send(JSON.stringify(grp));
            } else {
                return res.status(404).send(JSON.stringify({
                    error: "Group not found!"
                })
                );
            }
        } catch (e) {
            errorLog(res, e);
        }
    }

    static async GroupUpdate(req, res) {
        try {
            if (!req.body.name) {
                return res.status(400).send("Bad Request: Name not set!");
            } else {
                if (req.body.name === "") {
                    return res.status(400).send(JSON.stringify({
                        error: "Name must not be empty!"
                    })
                    );
                }
            }
            if (!req.body.id) {
                return res.status(400).send(JSON.stringify({
                    error: "ID not set!"
                })
                );
            } else {
                if (parseInt(req.body.id) === 0) {
                    return res.status(400).send(JSON.stringify({
                        error: "ID not set!"
                    })
                    );
                }
            }
            if (!req.body.parentID) {
                return res.status(400).send(JSON.stringify({
                    error: "ParentID not set!"
                })
                );
            }
            const id = req.body.id;
            const name = req.body.name;
            const parentID = req.body.parentID;
            const grp = await Groups.Get(id);
            if (grp !== null) {
                await Groups.Update(id, name, parentID);
                return res.send(JSON.stringify(await Groups.Get(id)));
            } else {
                return res.status(404).send(JSON.stringify({
                    error: "Group not found!"
                })
                );
            }
        } catch (e) {
            errorLog(res, e);
        }
    }
}

module.exports = Web;