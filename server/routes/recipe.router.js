const express = require('express');
const router = express.Router();
const service = require('../BL/recipe.service.js');
const { auth, loginAuth } = require('../middleware/auth.js');
const ApiMessages = require('../common/apiMessages.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });



router.get("/getAll", auth, async (req, res) => {
    try {
        const userId = req.body.userId
        const result = await service.getAllRecipes(true , userId);
        res.status(200).send({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("RouteName: recipe , Path: getAll , error message:", error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
})

router.get("/getById", auth, async (req, res) => {
    try {
         const userId = req.body.userId
        const { id } = req.query;
        const result = await service.getRecipeById(id , userId);
        res.status(200).send({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("RouteName: recipe , Path: getById , error message:", error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});

// get recipe details missing for recipeDetailPage - comments, ratedByMe, saved
router.get("/getDetails", auth, async (req, res) => {
    try {
        const userId = req.body.userId;
        const { id } = req.query;
        const result = await service.getRecipeDetails(id, userId);

        res.status(200).send({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("RouteName: recipe , Path: getDetails , error message:", error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});


router.post("/create", auth, upload.single('image'), async (req, res) => {
    try {

    

        let ingredients, instructions;

        try {
            ingredients = req.body.ingredients ? JSON.parse(req.body.ingredients) : [];
            instructions = req.body.instructions ? JSON.parse(req.body.instructions) : [];
        } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            return res.status(400).send({
                success: false,
                message: 'Invalid data format'
            });
        }

        const recipeInput = {
            userId: req.user.id,
            category: req.body?.category,
            title: req.body?.title,
            description: req.body?.description,
            instructions: instructions,
            ingredients: ingredients,
            prepTime: req.body?.prepTime,
            servings: req.body?.servings,
            difficultyLevel: req.body?.difficultyLevel,
            image: req.file
        };
        console.log('Recipe input: ============', recipeInput); // Debug log
        
        const result = await service.createRecipe(recipeInput);

        res.status(201).send({ success: true, data: result });

    } catch (error) {
        console.error("RouteName: recipe , Path: create , error message:", error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});

// not in use - didn't debug
router.put("/update/:id", auth, async (req, res) => {
    try {
        const recipeId = req.params.id;
        const currentUserId = req.body?.userId;

        const updateData = {
            userId: req.body.userId,
            category: req.body?.category,
            title: req.body?.title,
            description: req.body?.description,
            instructions: req.body?.instructions,
            ingredients: req.body?.ingredients,
            prepTime: req.body?.prepTime,
            servings: req.body?.servings,
            difficultyLevel: req.body?.difficultyLevel,
            imageUrl: req.body?.imageUrl
        };

        const result = await service.updateRecipe(recipeId, updateData, currentUserId);

        res.status(200).send({ success: true });

    } catch (error) {
        console.error("RouteName: recipe , Path: update , error message:", error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});


router.delete("/delete/:id", auth, async (req, res) => {
    try {
        const recipeId = req.params.id;
        const currentUserId = req.body?.userId;

        const result = await service.deleteRecipe(recipeId, currentUserId);

        res.status(200).send({ success: true });

    } catch (error) {
        console.error("RouteName: recipe , Path: delete , error message:", error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});



router.get("/myRecipes", auth, async (req, res) => {
    try {
        const currentUserId = req.body?.userId; // מהאותנטיקציה

        const result = await service.getRecipesByUser(currentUserId, 'currentUser');

        res.status(200).send({ success: true, data: result });

    } catch (error) {
        console.error("RouteName: recipe , Path: myRecipes , error message:", error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});

// קבלת המתכונים של משתמש מסוים (רק active)
router.get("/userRecipes/:userId", auth, async (req, res) => {
    try {
        const targetUserId = req.params.userId;

        const result = await service.getRecipesByUser(targetUserId, 'otherUser');

        res.status(200).send({ success: true, data: result });

    } catch (error) {
        console.error("RouteName: recipe , Path: userRecipes , error message:", error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});



module.exports = router;
