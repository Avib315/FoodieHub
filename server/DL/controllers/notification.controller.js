const notificationModel = require('../models/notification.model.js');

const create = async (data, isPopulate) => {
    return await notificationModel.create(data);
}

const read = async (filter) => {
    return await notificationModel.find(filter);
}

const readOne = async (filter) => {
    return await notificationModel.findOne(filter);
}

const update = async (filter, data) => {
    return await notificationModel.findOneAndUpdate(filter, data);
}

const del = async (filter) => {
    return await notificationModel.findOneAndDelete(filter);
}

const updateMany = async (filter, data) => {
  return await notificationModel.updateMany(filter, data);
};

const count = async (filter) => {
  return await notificationModel.countDocuments(filter);
};

module.exports = {
    create,
    read,
    readOne,
    update,
    del,
    updateMany,
    count
}