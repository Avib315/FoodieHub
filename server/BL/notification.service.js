const notificationController = require("../DL/controllers/notification.controller.js");
const ApiMessages = require("../common/apiMessages.js");

async function getNotificationByUserId(userId) {
    if (!userId) return { success: false, message: ApiMessages.errorMessages.forbidden };
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        return { success: false, message: ApiMessages.errorMessages.invalidId };
    }
    const notification = await notificationController.read({ userId });
    return {success: true, data: notification};
}

module.exports = { getNotificationByUserId };