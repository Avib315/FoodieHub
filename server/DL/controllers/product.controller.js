const productModel = require('../models/product.model.js');

const create = async (data, isPopulate) => {
    return await productModel.create(data);
}

const read = async (filter) => {
    return await productModel.find(filter);
}

const readOne = async (filter) => {
    return await productModel.findOne(filter);
}

const update = async (filter, data) => {
    return await productModel.findOneAndUpdate(filter, data);
}

const del = async (filter) => {
    return await productModel.findOneAndDelete(filter);
}

module.exports = {
    create,
    read,
    readOne,
    update,
    del
}
