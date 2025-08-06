const express = require('express');
const router = express.Router();
const service = require('../BL/savedRecipe.service.js');
const { auth, loginAuth } = require('../middleware/auth.js');
const ApiMessages = require('../common/apiMessages.js');

router.post("/add", auth, async (req, res) => {
    try {
        const { userId, recipeId } = req.body;

        const result = await service.addSavedRecipe(userId, recipeId);
        res.status(201).send({ success: result });  // will be true since didn't throw
    } catch (error) {
        console.error('RouteName: savedRecipe , Path: post/ , error message: ', error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});

router.get("/getAll", auth, async (req, res) => {
    try {
        const { userId } = req.body;
        const result = await service.getSavedRecipes(userId);
        console.log(result);
        res.status(200).send({ success: true, data: result });
    } catch (error) {
        console.error('RouteName: savedRecipe , Path: get/ , error message: ', error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});

router.delete("/remove/:recipeId", auth, async (req, res) => {
    try {
        const { userId } = req.body;
        const { recipeId } = req.params;
        const result = await service.removeSavedRecipe(userId, recipeId);
        res.status(200).send({ success: result });  // will be true since didn't throw
    } catch (error) {
        console.error('RouteName: savedRecipe , Path: delete/ , error message: ', error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});

router.get("/count", auth, async (req, res) => {
    try {
        const { userId } = req.body;
        const count = await service.countSavedRecipes(userId);
        res.status(200).send({ success: true, data: count });
    } catch (error) {
        console.error('RouteName: savedRecipe , Path: get/coynt/ , error message: ', error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});

module.exports = router;