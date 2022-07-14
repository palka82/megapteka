const Storage = require("../core/storage");

class Groups {
    static async List() {
        try {
            return await Storage.tableGroups.findAll({})
        } catch (e) {
            throw e;
        }
    }

    static async Add(name ='', parentID = 0) {
        try {
            if (parseInt(parentID) > 0) {
                const grp = await Storage.tableGroups.findByPk(parentID);
                if (grp == null) {
                    throw Error(`Group with parentID [${parentID}] not found!`);
                }
            }
            return await Storage.tableGroups.create({
                name: name,
                parentId: parentID
            })
        } catch (e) {
            throw e;
        }
    }

    static async Del(id) {
        try {
            const count = await Storage.tableGroupProduct.count({
                where: {
                    groupId: id
                }
            });
            if (parseInt(count) > 0) {
                throw Error(`There are products in this group. Can't be deleted!`);
            } else {
                await Storage.tableGroups.destroy({
                    where: {
                        id: id
                    }
                });
            }
        } catch (e) {
            throw e;
        }
    }

    static async Get(id) {
        try {
            return await Storage.tableGroups.findOne({
                attributes: ["id", "name"],
                where: {
                    id: id
                }
            });
        } catch (e) {
            throw e;
        }
    }

    static async Update(id, name, parentID) {
        try {
            if (parseInt(parentID) > 0) {
                const grp = await Storage.tableGroups.findByPk(parentID);
                if (grp == null) {
                    throw Error(`Group with parentID [${parentID}] not found!`);
                }
            }

            await Storage.tableGroups.update({
               name: name,
               parentId: parentID
           }, {
               where: {
                   id: id
               }
           });
        } catch (e) {
            throw e;
        }
    }
}

module.exports = Groups;