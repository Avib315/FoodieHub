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
        console.error("Error getting recipes", error);
        res.status(500)
    }
});

router.get("/getAll", async (req, res) => {
    try {
        const result = await service.getAllRecipes();
        res.status(200).send(result);
    } catch (error) {
        console.error("Error getting recipes", error);
        res.status(500)
    }
})

router.get("/getById", async (req, res) => {
    try {
        // קבלת ה-ID מה-query parameters
        const { id } = req.query;
        console.log("Received ID:", id);
        const result = await service.getRecipeById(id);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error getting recipe by ID:", error);
        res.status(500)
    }
});



router.post("/create", loginAuth, async (req, res) => {
    try {
        const recipeInput = {
            userId: req.body?.id,
            categoryId: req.body?.categoryId,
            title: req.body?.title,
            description: req.body?.description,
            instructions: req.body?.instructions,
            ingredients: req.body?.ingredients,
            prepTime: req.body?.prepTime,
            servings: req.body?.servings,
            difficultyLevel: req.body?.difficultyLevel,
            imageUrl: req.body?.imageUrl
        };

        const result = await service.createRecipe(recipeInput);
        
        if (result.success) {
            res.status(201).send(result);
        } else {
            res.status(400).send(result);
        }
    } catch (error) {
        console.error("Error creating recipe", error);
        res.status(500).send({
            success: false,
            message: ApiMessages.SERVER_ERROR || "Internal server error"
        });
    }
});


module.exports = router;
