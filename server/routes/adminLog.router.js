const express = require('express');
const router = express.Router();
const service = require('../BL/adminLog.service.js');
const { auth, loginAuth } = require('../middleware/auth.js');
const ApiMessages = require('../common/apiMessages.js');

// GET all logs (optionally with filters)
router.get("/", auth, async (req, res) => {
    try {
        const result = await service.getAllLogs(req.query); // support filters via query params
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ success: false, message: ApiMessages.errorMessages.serverError });
    }
});

// POST create a new log
router.post("/create", auth, async (req, res) => {
    try {
        const result = await service.createLog(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error("Error creating log:", error);
        res.status(500).json({ success: false, message: ApiMessages.errorMessages.serverError });
    }
});

// GET logs by admin ID
router.get("/byAdmin/:id", auth, async (req, res) => {
    try {
        const result = await service.getLogsByAdminId(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching logs by admin ID:", error);
        res.status(500).json({ success: false, message: ApiMessages.errorMessages.serverError });
    }
});

// GET logs by target type and ID (e.g. logs for a specific recipe or user)
router.get("/byTarget/:type/:id", auth, async (req, res) => {
    try {
        const { type, id } = req.params;
        const result = await service.getLogsByTarget(type, id);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching logs by target:", error);
        res.status(500).json({ success: false, message: ApiMessages.errorMessages.serverError });
    }
});

module.exports = router;
