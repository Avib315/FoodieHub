const express = require('express');
const router = express.Router();
const service = require('../BL/categories.service.js');
const { auth, loginAuth } = require('../middleware/auth.js');
const ApiMessages = require('../common/apiMessages.js');


router.get("/getAll", async (req, res) => {
    try {
        const result = await service.getAllCategories();
        res.status(200).send(result);
    } catch (error) {

    }
})


module.exports = router;
