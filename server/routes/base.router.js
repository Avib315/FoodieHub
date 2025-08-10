const express = require('express');
const router = express.Router();
const ApiMessages = require('../common/apiMessages.js');

router.get('/', async (req, res) => {
    try {
        res.status(200).send({ success: true, message:"this a api check" });

    } catch (error) {
        console.error('RouteName: admin , Path: login , error message: ', error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError,
        });
    }
});








module.exports = router;
