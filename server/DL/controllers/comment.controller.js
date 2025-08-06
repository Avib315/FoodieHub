const commentModel = require('../models/comment.model.js');

const create = async (data, isPopulate) => {
    return await commentModel.create(data);
}

const read = async (filter) => {
    return await commentModel.find(filter);
}

const readOne = async (filter) => {
    return await commentModel.findOne(filter);
}

const update = async (filter, data) => {
    return await commentModel.findOneAndUpdate(filter, data);
}

const del = async (filter) => {
    return await commentModel.findOneAndDelete(filter);
}

const deleteMany = async (filter) => {
    return await commentModel.deleteMany(filter);
};

module.exports = {
    create,
    read,
    readOne,
    update,
    del,
    deleteMany
}