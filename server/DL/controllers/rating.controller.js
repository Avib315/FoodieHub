const ratingModel = require('../models/rating.model.js');

const create = async (data, isPopulate) => {
    return await ratingModel.create(data);
}

const read = async (filter) => {
    return await ratingModel.find(filter);
}

const readOne = async (filter) => {
    return await ratingModel.findOne(filter);
}

const update = async (filter, data) => {
    return await ratingModel.findOneAndUpdate(filter, data);
}

const del = async (filter) => {
    return await ratingModel.findOneAndDelete(filter);
}

const deleteMany = async (filter) => {
    return await ratingModel.deleteMany(filter);
};

module.exports = {
    create,
    read,
    readOne,
    update,
    del,
    deleteMany
}