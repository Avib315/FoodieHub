const notificationController = require("../DL/controllers/notification.controller.js");
const recipeController = require("../DL/controllers/recipe.controller.js");
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

async function addRecipeRatedNotification(recipeId) {
    if (!recipeId) {
        console.log(ApiMessages.errorMessages.missingRequiredFields);
        return false;
    }
    if (!recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log(ApiMessages.errorMessages.invalidData);
        return false;
    }

    const recipe = await recipeController.readOne({ _id: recipeId });
    if (!recipe) {
        console.log(ApiMessages.errorMessages.notFound);
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
        console.log(ApiMessages.errorMessages.creationFailed);
        return false;
    }
    return notification._id;
}

async function addRecipeCommentedNotification(recipeId) {
    if (!recipeId) {
        console.log(ApiMessages.errorMessages.missingRequiredFields);
        return false;
    }
    if (!recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log(ApiMessages.errorMessages.invalidData);
        return false;
    }

    const recipe = await recipeController.readOne({ _id: recipeId });
    if (!recipe) {
        console.log(ApiMessages.errorMessages.notFound);
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
        console.log(ApiMessages.errorMessages.creationFailed);
        return false;
    }
    return notification._id;
}

async function addRecipeApprovedNotification(recipeId) {
    if (!recipeId) {
        console.log(ApiMessages.errorMessages.missingRequiredFields);
        return false;
    }
    if (!recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log(ApiMessages.errorMessages.invalidData);
        return false;
    }

    const recipe = await recipeController.readOne({ _id: recipeId });
    if (!recipe) {
        console.log(ApiMessages.errorMessages.notFound);
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
        console.log(ApiMessages.errorMessages.creationFailed);
        return false;
    }
    return notification._id;
}

async function addRecipeRejectedNotification(recipeId) {
    if (!recipeId) {
        console.log(ApiMessages.errorMessages.missingRequiredFields);
        return false;
    }
    if (!recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log(ApiMessages.errorMessages.invalidData);
        return false;
    }

    const recipe = await recipeController.readOne({ _id: recipeId });
    if (!recipe) {
        console.log(ApiMessages.errorMessages.notFound);
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
        console.log(ApiMessages.errorMessages.creationFailed);
        return false;
    }
    return notification._id;
}

async function addSystemNotification(userId, title, message) {
    if (!userId || !title || !message) {
        console.log(ApiMessages.errorMessages.missingRequiredFields);
        return false;
    }

    if (!userId.toString().match(/^[0-9a-fA-F]{24}$/) ||
        typeof title !== 'string' || typeof message !== 'string') {
        console.log(ApiMessages.errorMessages.invalidData);
        return false;
    }

    const notification = await notificationController.create({
        userId,
        type: 'system',
        title,
        message
    });

    if (!notification) {
        console.log(ApiMessages.errorMessages.creationFailed);
        return false;
    }
    return notification._id;
}

async function markNotificationsAsRead(userId, notificationIds) {
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

    // Check if all notifications belong to the user
    const count = await notificationController.count({
        _id: { $in: notificationIds },
        userId: userId
    });

    if (count !== notificationIds.length) {
        throw new Error(ApiMessages.errorMessages.unauthorized);
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

async function deleteNotification(id) {
    if (!id) {
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    const result = await notificationController.del({ _id: id });

    if (result.deletedCount === 0) {
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
