const notificationController = require("../DL/controllers/notification.controller.js");
const ApiMessages = require("../common/apiMessages.js");

async function getNotificationByUserId(userId) {
    if (!userId) {
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    const notification = await notificationController.read({ userId });

    if (!notification) {
        throw new Error(ApiMessages.errorMessages.notFound);
    }
    return notification;
}

async function addRecipeRatedNotification(userId, recipeId) {
    if (!userId || !recipeId) {
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }
    if (!userId.match(/^[0-9a-fA-F]{24}$/) || !recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    const notification = await notificationController.create({
        userId,
        type: 'recipe_rated',
        title: 'Your recipe was rated!',
        message: 'Someone just rated your recipe. Check out the feedback!',
        relatedId: recipeId
    });

    if (!notification) {
        throw new Error(ApiMessages.errorMessages.creationFailed);
    }
    return notification._id;
}

async function addRecipeCommentedNotification(userId, recipeId) {
    if (!userId || !recipeId) {
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }
    if (!userId.match(/^[0-9a-fA-F]{24}$/) || !recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    const notification = await notificationController.create({
        userId,
        type: 'recipe_commented',
        title: 'New comment on your recipe',
        message: 'Someone commented on your recipe. Take a look!',
        relatedId: recipeId
    });

    if (!notification) {
        throw new Error(ApiMessages.errorMessages.creationFailed);
    }
    return notification._id;
}

async function addRecipeApprovedNotification(userId, recipeId) {
    if (!userId || !recipeId) {
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }
    if (!userId.match(/^[0-9a-fA-F]{24}$/) || !recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    const notification = await notificationController.create({
        userId,
        type: 'recipe_approved',
        title: 'Recipe Approved',
        message: 'Congratulations! Your recipe has been approved.',
        relatedId: recipeId
    });

    if (!notification) {
        throw new Error(ApiMessages.errorMessages.creationFailed);
    }
    return notification._id;
}

async function addRecipeRejectedNotification(userId, recipeId) {
    if (!userId || !recipeId) {
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }
    if (!userId.match(/^[0-9a-fA-F]{24}$/) || !recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    const notification = await notificationController.create({
        userId,
        type: 'recipe_rejected',
        title: 'Recipe Rejected',
        message: 'Unfortunately, your recipe was not approved. Please review it and try again.',
        relatedId: recipeId
    });

    if (!notification) {
        throw new Error(ApiMessages.errorMessages.creationFailed);
    }
    return notification._id;
}

async function addSystemNotification(userId, title, message) {
    if (!userId || !recipeId || !title || !message) {
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }
    if (!userId.match(/^[0-9a-fA-F]{24}$/) || !recipeId.match(/^[0-9a-fA-F]{24}$/) ||
        typeof title !== 'string' || typeof message !== 'string') {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    const notification = await notificationController.create({
        userId,
        type: 'system',
        title,
        message
    });

    if (!notification) {
        throw new Error(ApiMessages.errorMessages.creationFailed);
    }
    return notification._id;
}

async function markNotificationsAsRead(notificationIds) {
    if (!Array.isArray(notificationIds)) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    if (notificationIds.length === 0) {
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    const isValidIds = notificationIds.every(id => /^[0-9a-fA-F]{24}$/.test(id));
    if (!isValidIds) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    const result = await notificationController.updateMany(
        { _id: { $in: notificationIds } },
        { $set: { isRead: true } }
    );

    if (result.modifiedCount !== result.matchedCount) {
        throw new Error(ApiMessages.errorMessages.updateFailed);
    }
    return true;
}

async function countUnreadNotifications(userId) {
    if (!userId) {
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    const count = await notificationController.count({ userId, isRead: false });

    if (count === null) {
        throw new Error(ApiMessages.errorMessages.serverError);
    }
    return count;
}


module.exports = {
    getNotificationByUserId,
    addRecipeRatedNotification,
    addRecipeCommentedNotification,
    addRecipeApprovedNotification,
    addRecipeRejectedNotification,
    addSystemNotification,
    markNotificationsAsRead,
    countUnreadNotifications
};
