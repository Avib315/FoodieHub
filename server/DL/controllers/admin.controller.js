const adminModel = require('../models/admin.model.js');

const create = async (data, isPopulate) => {
    return await adminModel.create(data);
}

const read = async (filter) => {
    return await adminModel.find(filter);
}

const readOne = async (filter) => {
    return await adminModel.findOne(filter);
}

const update = async (filter, data) => {
    return await adminModel.findOneAndUpdate(filter, data);
}

const del = async (filter) => {
    return await adminModel.findOneAndDelete(filter);
}

module.exports = {
    create,
    read,
    readOne,
    update,
    del
}