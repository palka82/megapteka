const Storage = require("../core/storage");

class Product {
    static async List() {
        try {
            return await Storage.tableProducts.findAll({
                include: "groups",
                through: {
                    attributes: ["id", "name"],
                },
            });
        } catch (e) {
            throw e
        }
    }

    static async Add(name, description, vendor, groupsID) {
        const t = await Storage._dbConn.transaction();

        try {
            const product = await Storage.tableProducts.create({
                name: name,
                description: description,
                vendor: vendor
            }, {
                transaction: t
            });
            for (let groupID of groupsID) {
                let group = await Storage.tableGroups.findByPk(groupID, {
                    transaction: t
                });
                if (group !== null) {
                    //Группа нашлась
                    //Теперь смотрим сколько у нее потомков
                    const parentCount = await Storage.tableGroups.count({
                        where: {
                            parentId: groupID
                        },
                        transaction: t
                    });
                    if (parentCount === 0) {
                        await Storage.tableGroupProduct.create({
                            productId: product.id,
                            groupId: groupID
                        }, {
                            transaction: t
                        });
                    } else {
                        throw Error(`Items cannot be added to this group [${groupID}]!`)
                    }
                } else {
                    throw Error(`Product.Add | Group number [${groupID}] not found!`);
                }
            }
            await t.commit();
            return product;
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }

    static async Del(id) {
        const t = await Storage._dbConn.transaction();
        try {
            await Storage.tableGroupProduct.destroy({
                where: {
                    productId: id
                },
                transaction: t
            });
            await Storage.tableProducts.destroy({
                where: {
                    id: id
                },
                transaction: t
            });
            await t.commit()
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }

    static async Get(id) {
        try {
            return await Storage.tableProducts.findOne({
                where: {
                    id: id
                },
                include: "groups"
            });
        } catch (e) {
            throw e;
        }
    }

    static async Update(id, name, description, vendor, groupsID) {
        const t = await Storage._dbConn.transaction();

        try {
            await Storage.tableGroupProduct.destroy({
                where: {
                    productId: id
                },
                transaction: t
            });
            for (let groupID of groupsID) {
                let group = await Storage.tableGroups.findByPk(groupID, {
                    transaction: t
                });
                if (group !== null) {
                    //Группа нашлась
                    //Теперь смотрим сколько у нее потомков
                    const parentCount = await Storage.tableGroups.count({
                        where: {
                            parentId: groupID
                        },
                        transaction: t
                    });
                    if (parentCount === 0) {
                        await Storage.tableGroupProduct.create({
                            productId: id,
                            groupId: groupID
                        }, {
                            transaction: t
                        });
                    } else {
                        throw Error(`Items cannot be added to this group [${groupID}]!`)
                    }
                } else {
                    throw Error(`Product.Update | Group number [${groupID}] not found!`);
                }
            }
            await Storage.tableProducts.update({
                name: name,
                description: description,
                vendor: vendor,
            }, {
                where: {
                    id: id
                },
                transaction: t
            });
            await t.commit();
         } catch (e) {
            await t.rollback();
            throw e;
        }
    }
}

module.exports = Product;