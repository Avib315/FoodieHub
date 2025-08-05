const express = require('express');
const router = express.Router();
const service = require('../BL/notification.service.js');
const { auth, loginAuth } = require('../middleware/auth.js');
const ApiMessages = require('../common/apiMessages.js');

router.get("/getAll",auth ,async (req, res) => {
    try {
        const { userId } = req.body;
        console.log(userId);
        
        console.log("Received ID:", userId);

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


router.put("/markAsRead", async (req, res) => {
    try {
        const { notificationIds } = req.body;
        const result = await service.markNotificationsAsRead(notificationIds);
        res.status(200).send({ success: result }); // will be true since didn't throw

    } catch (error) {
        console.error('RouteName: notification , Path: markAsRead , error message: ', error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});

router.get("/countUnread", async (req, res) => {
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


module.exports = router;