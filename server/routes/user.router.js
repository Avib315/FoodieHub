const express = require('express');
const router = express.Router();
const service = require('../BL/user.service.js');
const { auth, loginAuth } = require('../middleware/auth.js');
const ApiMessages = require('../common/apiMessages.js');

router.post('/login', async (req, res) => {
    
    try {
        
        const userInput = {
            email: req.body?.email,
            password: req.body?.password
        }
        const { token , user } = await service.login(userInput);

        if (token) {
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: "None" });
        }

        res.status(200).send({success: true, user: user});
            
    } catch (error) {
        console.error("RouteName: user : login : error message:", error.message);
        res.status(500).send({ login: false, message: error.message || ApiMessages.errorMessages.serverError });
    }
});

router.post('/register', async (req, res) => {
    try {
        const result = await service.register(req.body);
        res.status(200).send({success: true, result});
    } catch (error) {
        console.error("RouteName: user : register : error message:", error.message);
        res.status(500).send({ registered: false, message: error.message || ApiMessages.errorMessages.serverError });
    }
});
router.get('/getUserData', async (req, res) => {
    try {
        const userId = req.body.userId
        const result = await service.getUser(userId);
        res.status(200).send(result);
    } catch (error) {
        console.error("RouteName: user : getUserData : error message:", error.message);
        res.status(500).send({ registered: false, message: error.message || ApiMessages.errorMessages.serverError });
    }
});

router.get('/isAuthenticated', auth, async (req, res) => {
    try {
        res.status(200).send(true);
    } catch (error) {
        res.status(500).send({ isAuthenticated: false, message: error.message || ApiMessages.errorMessages.serverError });
    }
});

module.exports = router;
