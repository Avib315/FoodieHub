const recipeModel = require('../models/recipe.model.js');

const create = async (data, isPopulate) => {
    return await recipeModel.create(data);
}

const read = async (filter) => {
    return await recipeModel.find(filter);
}

const readOne = async (filter) => { // {_id:2}
    return await recipeModel.findOne(filter);
}

const update = async (filter, data) => {
    return await recipeModel.findOneAndUpdate(filter, data);
}

const del = async (filter) => {
    return await recipeModel.findOneAndDelete(filter);
}

module.exports = {
    create,
    read,
    readOne,
    update,
    del
}
