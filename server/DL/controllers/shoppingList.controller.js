const shoppingListModel = require('../models/shoppingList.model.js');

const create = async (data, isPopulate) => {
    return await shoppingListModel.create(data);
}

const read = async (filter) => {
    return await shoppingListModel.find(filter);
}

const readOne = async (filter) => {
    return await shoppingListModel.findOne(filter);
}

const update = async (filter, data) => {
    return await shoppingListModel.findOneAndUpdate(filter, data);
}

const del = async (filter) => {
    return await shoppingListModel.findOneAndDelete(filter);
}

module.exports = {
    create,
    read,
    readOne,
    update,
    del
}