const savedRecipeModel = require('../models/savedRecipe.model.js');

const create = async (data, isPopulate) => {
    return await savedRecipeModel.create(data);
}

const read = async (filter) => {
    return await savedRecipeModel.find(filter);
}

const readOne = async (filter) => {
    return await savedRecipeModel.findOne(filter);
}

const update = async (filter, data) => {
    return await savedRecipeModel.findOneAndUpdate(filter, data);
}

const del = async (filter) => {
    return await savedRecipeModel.findOneAndDelete(filter);
}

const count = async (filter) => {
    return await savedRecipeModel.countDocuments(filter);
}

module.exports = {
    create,
    read,
    readOne,
    update,
    del,
    count
}
