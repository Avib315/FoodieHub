const express = require('express');
const router = express.Router();
const service = require('../BL/admin.service.js');
const { auth, loginAuth } = require('../middleware/auth.js');
const ApiMessages = require('../common/apiMessages.js');

router.post('/login', async (req, res) => {
    try {
        const adminInput = {
            email: req.body?.email,
            password: req.body?.password
        };

        const { token, admin } = await service.login(adminInput);

        if (token) {
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: "None" });
        }

        res.status(200).send({ success: true, data: admin });

    } catch (error) {
        console.error('RouteName: admin , Path: login , error message: ', error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});

router.get('/isAuthenticated', auth, async (req, res) => {
    try {
        res.status(200).send(true);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});

module.exports = router;
