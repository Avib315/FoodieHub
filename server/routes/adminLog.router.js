const express = require('express');
const router = express.Router();
const service = require('../BL/adminLog.service.js');
const { auth, loginAuth, adminAuth } = require('../middleware/auth.js');
const ApiMessages = require('../common/apiMessages.js');

// GET all logs (optionally with filters)
router.get("/getAll", adminAuth, async (req, res) => {
    try {
        const result = await service.getAllLogs(req.query); // support filters via query params
        res.status(200).send({ success: true, data: result });
    } catch (error) {
        console.error('RouteName: adminLog , Path: /getAll , error message: ', error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});

// POST create a new log
router.post("/create", adminAuth, async (req, res) => {
    try {
        const result = await service.createLog(req.body);
        res.status(201).send({ success: true, data: result });
    } catch (error) {
        console.error('RouteName: adminLog , Path: create , error message: ', error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});

// GET logs by target type and ID (e.g. logs for a specific recipe or user)
router.get("/byTarget/:type/:id", adminAuth, async (req, res) => {
    try {
        const { type, id } = req.params;
        const result = await service.getLogsByTarget(type, id);
        res.status(200).send({ success: true, data: result });
    } catch (error) {
        console.error('RouteName: adminLog , Path: get/byTarget/:type/:id , error message: ', error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});

module.exports = router;
