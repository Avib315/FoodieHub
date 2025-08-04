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

async function addRecipeRatedNotification(userId, recipeId) {
    return notificationController.create({
        userId,
        type: 'recipe_rated',
        title: 'Your recipe was rated!',
        message: 'Someone just rated your recipe. Check out the feedback!',
        relatedId: recipeId
    });
}

async function addRecipeCommentedNotification(userId, recipeId) {
    return notificationController.create({
        userId,
        type: 'recipe_commented',
        title: 'New comment on your recipe',
        message: 'Someone commented on your recipe. Take a look!',
        relatedId: recipeId
    });
}

async function addRecipeApprovedNotification(userId, recipeId) {
    return notificationController.create({
        userId,
        type: 'recipe_approved',
        title: 'Recipe Approved',
        message: 'Congratulations! Your recipe has been approved.',
        relatedId: recipeId
    });
}

async function addRecipeRejectedNotification(userId, recipeId) {
    return notificationController.create({
        userId,
        type: 'recipe_rejected',
        title: 'Recipe Rejected',
        message: 'Unfortunately, your recipe was not approved. Please review it and try again.',
        relatedId: recipeId
    });
}

async function addSystemNotification(userId, title, message) {
    return notificationController.create({
        userId,
        type: 'system',
        title,
        message
    });
}


module.exports = {
    getNotificationByUserId,
    addRecipeRatedNotification,
    addRecipeCommentedNotification,
    addRecipeApprovedNotification,
    addRecipeRejectedNotification,
    addSystemNotification
};
