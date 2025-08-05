const userModel = require('../models/user.model.js');

const create = async (data, isPopulate) => {

    
    return await userModel.create(data);
}

const read = async (filter) => {
    return await userModel.find(filter);
}

const readOne = async (filter) => {
    return await userModel.findOne(filter);
}

const update = async (filter, data) => {
    return await userModel.findOneAndUpdate(filter, data);
}

const del = async (filter) => {
    return await userModel.findOneAndDelete(filter);
}

module.exports = {
    create,
    read,
    readOne,
    update,
    del
}