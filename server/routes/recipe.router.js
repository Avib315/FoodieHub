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

router.post('/register', async (req, res) => {
    try {
        const userInput = {
            name: `${req.body?.fName.trim()} ${req.body?.lName.trim()}`,
            email: req.body?.email,
            password: req.body?.password,
            avatar: req.body?.avatar
        };

        const result = await userService.register(userInput);
        res.status(200).send(result);
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).send({ registered: false, message: 'Something went wrong' });
    }
});
router.get('/getUserData', auth, async (req, res) => {
    try {
        const userId = req.body.userId
        const result = await userService.getUser(userId);
        res.status(200).send(result);
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).send({ registered: false, message: 'Something went wrong' });
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
