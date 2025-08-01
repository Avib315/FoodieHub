const adminLogModel = require('../models/adminLog.model.js');

const create = async (data, isPopulate) => {
    return await adminLogModel.create(data);
}

const read = async (filter) => {
    return await adminLogModel.find(filter);
}

const readOne = async (filter) => {
    return await adminLogModel.findOne(filter);
}

const update = async (filter, data) => {
    return await adminLogModel.findOneAndUpdate(filter, data);
}

const del = async (filter) => {
    return await adminLogModel.findOneAndDelete(filter);
}

module.exports = {
    create,
    read,
    readOne,
    update,
    del
}