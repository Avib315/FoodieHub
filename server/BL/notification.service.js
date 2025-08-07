const notificationController = require("../DL/controllers/notification.controller.js");
const recipeController = require("../DL/controllers/recipe.controller.js");
const ApiMessages = require("../common/apiMessages.js");

async function getNotificationByUserId(userId) {
    if (!userId) {
        console.log("getNotificationByUserId: userId is required");
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("getNotificationByUserId: userId is not a valid ObjectId");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    const notification = await notificationController.read({ userId });

    if (!notification) {
        console.log("getNotificationByUserId: No notifications found for the given userId");
        throw new Error(ApiMessages.errorMessages.notFound);
    }
    return notification;
}

async function addRecipeRatedNotification(recipeId) {
    if (!recipeId) {
        console.log("addRecipeRatedNotification: Missing required field: recipeId");
        return false;
    }
    if (!recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("addRecipeRatedNotification: Invalid recipeId format provided");
        return false;
    }

    const recipe = await recipeController.readOne({ _id: recipeId });
    if (!recipe) {
        console.log("addRecipeRatedNotification: Recipe not found");
        return false;
    }

    const notification = await notificationController.create({
        userId: recipe.userId,
        type: 'recipe_rated',
        title: 'המתכון שלך דורג!',
        message: 'מישהו דירג את המתכון שלך. בדוק את המשוב!',
        relatedId: recipeId
    });

    if (!notification) {
        console.log("addRecipeRatedNotification: Notification creation failed");
        return false;
    }
    return notification._id;
}

async function addRecipeCommentedNotification(recipeId) {
    if (!recipeId) {
        console.log("addRecipeCommentedNotification: recipeId is required");
        return false;
    }
    if (!recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("addRecipeCommentedNotification: recipeId is not a valid ObjectId");
        return false;
    }

    const recipe = await recipeController.readOne({ _id: recipeId });
    if (!recipe) {
        console.log("addRecipeCommentedNotification: Recipe not found");
        return false;
    }

    const notification = await notificationController.create({
        userId: recipe.userId,
        type: 'recipe_commented',
        title: 'תגובה חדשה על המתכון שלך',
        message: 'מישהו הגיב על המתכון שלך. שווה לבדוק!',
        relatedId: recipeId
    });

    if (!notification) {
        console.log("addRecipeCommentedNotification: Notification creation failed");
        return false;
    }
    return notification._id;
}

async function addRecipeApprovedNotification(recipeId) {
    if (!recipeId) {
        console.log("addRecipeApprovedNotification: recipeId is required");
        return false;
    }
    if (!recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("addRecipeApprovedNotification: recipeId is not a valid ObjectId");
        return false;
    }

    const recipe = await recipeController.readOne({ _id: recipeId });
    if (!recipe) {
        console.log("addRecipeApprovedNotification: Recipe not found");
        return false;
    }

    const notification = await notificationController.create({
        userId: recipe.userId,
        type: 'recipe_approved',
        title: 'המתכון אושר',
        message: 'מזל טוב! המתכון שלך אושר.',
        relatedId: recipeId
    });

    if (!notification) {
        console.log("addRecipeApprovedNotification: Notification creation failed");
        return false;
    }
    return notification._id;
}

async function addRecipeRejectedNotification(recipeId) {
    if (!recipeId) {
        console.log("addRecipeRejectedNotification: recipeId is required");
        return false;
    }
    if (!recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("addRecipeRejectedNotification: recipeId is not a valid ObjectId");
        return false;
    }

    const recipe = await recipeController.readOne({ _id: recipeId });
    if (!recipe) {
        console.log("addRecipeRejectedNotification: Recipe not found");
        return false;
    }

    const notification = await notificationController.create({
        userId: recipe.userId,
        type: 'recipe_rejected',
        title: 'המתכון נדחה',
        message: 'לצערנו, המתכון שלך לא אושר. בדוק אותו ונסה שוב.',
        relatedId: recipeId
    });

    if (!notification) {
        console.log("addRecipeRejectedNotification: Notification creation failed");
        return false;
    }
    return notification._id;
}

async function addSystemNotification(userId, title, message) {
    if (!userId || !title || !message) {
        console.log("addSystemNotification: Missing required fields: userId, title, or message");
        return false;
    }

    if (!userId.toString().match(/^[0-9a-fA-F]{24}$/) ||
        typeof title !== 'string' || typeof message !== 'string') {
        console.log("addSystemNotification: Invalid data provided");
        return false;
    }

    const notification = await notificationController.create({
        userId,
        type: 'system',
        title,
        message
    });

    if (!notification) {
        console.log("addSystemNotification: Notification creation failed");
        return false;
    }
    return notification._id;
}

async function markNotificationsAsRead(userId, notificationIds) {
    if (!Array.isArray(notificationIds)) {
        console.log("markNotificationsAsRead: notificationIds must be an array");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    if (notificationIds.length === 0) {
        console.log("markNotificationsAsRead: No notification IDs provided");
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    const isValidIds = notificationIds.every(id => /^[0-9a-fA-F]{24}$/.test(id));
    if (!isValidIds) {
        console.log("markNotificationsAsRead: One or more notification IDs are not valid ObjectIds");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // Check if all notifications belong to the user
    const count = await notificationController.count({
        _id: { $in: notificationIds },
        userId: userId
    });

    if (count !== notificationIds.length) {
        console.log("markNotificationsAsRead: Unauthorized action - not all notifications belong to the user");
        throw new Error(ApiMessages.errorMessages.unauthorized);
    }

    const result = await notificationController.updateMany(
        { _id: { $in: notificationIds } },
        { $set: { isRead: true } }
    );

    if (result.modifiedCount !== result.matchedCount) {
        console.log("markNotificationsAsRead: Some notifications were not updated");
        throw new Error(ApiMessages.errorMessages.updateFailed);
    }
    return true;
}

async function countUnreadNotifications(userId) {
    if (!userId) {
        console.log("countUnreadNotifications: userId is required");
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("countUnreadNotifications: userId is not a valid ObjectId");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    const count = await notificationController.count({ userId, isRead: false });

    if (count === null) {
        console.log("countUnreadNotifications: Error counting notifications ");
        throw new Error(ApiMessages.errorMessages.serverError);
    }
    return count;
}

async function deleteNotification(id) {
    if (!id) {
        console.log("deleteNotification: id is required");
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("deleteNotification: id is not a valid ObjectId");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    const result = await notificationController.del({ _id: id });

    if (result.deletedCount === 0) {
        console.log("deleteNotification: Notification not found");
        throw new Error(ApiMessages.errorMessages.notFound);
    }
    return true;
}


module.exports = {
    getNotificationByUserId,
    addRecipeRatedNotification,
    addRecipeCommentedNotification,
    addRecipeApprovedNotification,
    addRecipeRejectedNotification,
    addSystemNotification,
    markNotificationsAsRead,
    countUnreadNotifications,
    deleteNotification
};
