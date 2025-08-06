const express = require('express');
const router = express.Router();
const service = require('../BL/comment.service.js');
const { auth, loginAuth } = require('../middleware/auth.js');
const ApiMessages = require('../common/apiMessages.js');

router.get("/getComments/:recipeId", auth, async (req, res) => { // do i only see comments of recipes i own? if so i need to get userId from body
    try {
        const { recipeId } = req.params;
        const result = await service.getRecipeComments(recipeId);
        res.status(200).send({ success: true, data: result });
    } catch (error) {
        console.error('RouteName: comment , Path: getComments/ , error message: ', error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});

router.post("/create", auth, async (req, res) => {
    try {
        const { userId, recipeId, content } = req.body;
        const result = await service.createComment({ userId, recipeId, content });
        res.status(200).send({ success: true, data: result });
    } catch (error) {
        console.error('RouteName: comment , Path: create/ , error message: ', error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});

router.delete("/deleteAll/:recipeId", auth, async (req, res) => {
    try {
        const { recipeId } = req.params;
        const { userId } = req.body;
        const result = await service.deleteCommentsByRecipeId(userId, recipeId);
        res.status(200).send({ success: result }); // will be true since didn't throw
    } catch (error) {
        console.error('RouteName: comment , Path: deleteAll/ , error message: ', error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});



module.exports = router;