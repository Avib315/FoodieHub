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
        console.log(adminInput); 
        
        const { success , token } = await service.login(adminInput);

        if (token) {
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: "None" });
        }

        res.status(200).send({success});
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).send({ login: false, message: ApiMessages.errorMessages.forbidden });
    }
});

router.get('/isAuthenticated', auth, async (req, res) => {
    try {
        res.status(200).send(true);
    } catch (error) {
        res.status(500).send({ isAuthenticated: false, message: 'Something went wrong' });
    }
});

module.exports = router;
