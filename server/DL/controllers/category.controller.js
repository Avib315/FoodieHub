const categoryModel = require('../models/category.model.js');

const create = async (data, isPopulate) => {
    return await categoryModel.create(data);
}

const read = async (filter) => {
    return await categoryModel.find(filter);
}

const readOne = async (filter) => {
    return await categoryModel.findOne(filter);
}

const update = async (filter, data) => {
    return await categoryModel.findOneAndUpdate(filter, data);
}

const del = async (filter) => {
    return await categoryModel.findOneAndDelete(filter);
}

module.exports = {
    create,
    read,
    readOne,
    update,
    del
}