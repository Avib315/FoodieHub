const reportModel = require('../models/report.model.js');

const create = async (data, isPopulate) => {
    return await reportModel.create(data);
}

const read = async (filter) => {
    return await reportModel.find(filter);
}

const readOne = async (filter) => {
    return await reportModel.findOne(filter);
}

const update = async (filter, data) => {
    return await reportModel.findOneAndUpdate(filter, data);
}

const del = async (filter) => {
    return await reportModel.findOneAndDelete(filter);
}

module.exports = {
    create,
    read,
    readOne,
    update,
    del
}