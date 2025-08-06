const notificationService = require("./notification.service.js");
const adminLogService = require("./adminLog.service.js");
const ApiMessages = require("../common/apiMessages.js");

async function notifyRecipeStatus(recipeId, status) {
    const data = {
        targetType: 'recipe',
        targetId: recipeId
    }

    if (status === 'rejected') {
        await notificationService.addRecipeRejectedNotification(recipeId);
        data.action = "recipe_rejected";
    } else if (status === 'active') {
        await notificationService.addRecipeApprovedNotification(recipeId);
        data.action = "recipe_approved";
    }

    await adminLogService.createLog(data);
}


module.exports = {
    notifyRecipeStatus
};