const notificationController = require("../DL/controllers/notification.controller.js");
const ApiMessages = require("../common/apiMessages.js");

////////////////
async function getNotificationById(id) {
    if (!id) return { success: false, message: ApiMessages.errorMessages.forbidden };
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return { success: false, message: ApiMessages.errorMessages.invalidId };
    }
    const notification = await notificationController.readOne({ _id: id });
    return {success: true, data: notification};
}

module.exports = { getNotificationById };