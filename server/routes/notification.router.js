const express = require('express');
const router = express.Router();
const service = require('../BL/notification.service.js');
const { auth, loginAuth } = require('../middleware/auth.js');
const ApiMessages = require('../common/apiMessages.js');

router.get("/getById", async (req, res) => {
    try {
        const { id } = req.query;
        console.log("Received ID:", id);
        const result = await service.getNotificationByUserId(id);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error getting notifications by ID:", error);
        res.status(500)
    }
});

module.exports = router;