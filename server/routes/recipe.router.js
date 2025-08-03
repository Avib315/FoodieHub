const express = require('express');
const router = express.Router();
const service = require('../BL/recipe.service.js');
const { auth, loginAuth } = require('../middleware/auth.js');
const ApiMessages = require('../common/apiMessages.js');

router.post('/getAll', async (req, res) => {
    try {
        const recipeInput = {
            title: req.body?.title,
            ingredients: req.body?.ingredients,
            instructions: req.body?.instructions,
            freeSearch: req.body?.freeSearch,
            userId: req.body?.userId,
            page: req.body?.page || 1,
            limit: req.body?.limit || 10
        };
        const result = await service.getRecipes(recipeInput);
        res.status(200).send(result);
    } catch (error) {

    }
});
// http//localhost:3001/api/recipe/getAll
router.get("/getAll", async (req, res) => {
    try {
        const result = await service.getAllRecipes();
        res.status(200).send(result);
    } catch (error) {

    }
})


module.exports = router;
