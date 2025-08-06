const express = require('express');
const router = express.Router();
const service = require('../BL/notification.service.js');
const { auth, loginAuth } = require('../middleware/auth.js');
const ApiMessages = require('../common/apiMessages.js');

router.get("/getAll", auth, async (req, res) => {
    try {
        const { userId } = req.body;

        const result = await service.getNotificationByUserId(userId);
        res.status(200).send({ success: true, data: result });
    } catch (error) {
        console.error('RouteName: notification , Path: getById , error message: ', error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});

router.put("/markAsRead", auth, async (req, res) => {
    try {
        const { userId, notificationIds } = req.body;
        const result = await service.markNotificationsAsRead(userId, notificationIds);
        res.status(200).send({ success: result }); // will be true since didn't throw

    } catch (error) {
        console.error('RouteName: notification , Path: markAsRead , error message: ', error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});

router.get("/countUnread", auth, async (req, res) => {
    try {
        const { userId } = req.body;
        const count = await service.countUnreadNotifications(userId);
        res.status(200).send({ success: true, data: count });

    } catch (error) {
        console.error('RouteName: notification , Path: countUnread , error message: ', error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});

router.delete("/delete/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await service.deleteNotification(id);
        res.status(200).send({ success: result }); // will be true since didn't throw

    } catch (error) {
        console.error('RouteName: notification , Path: delete/:id , error message: ', error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});

module.exports = router;