const express = require('express');
const router = express.Router();
const service = require('../BL/admin.service.js');
const {  adminAuth } = require('../middleware/auth.js');
const ApiMessages = require('../common/apiMessages.js');

router.post('/login', async (req, res) => {
    try {
        const adminInput = {
            email: req.body?.email,
            password: req.body?.password
        };

        const { token, admin } = await service.login(adminInput);

        if (token) {
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: "None" });
        }

        res.status(200).send({ success: true, data: admin });

    } catch (error) {
        console.error('RouteName: admin , Path: login , error message: ', error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});

router.get('/isAuthenticated', adminAuth, async (req, res) => {
    try {
        res.status(200).send(true);
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError
        });
    }
});


router.get("/getAllRecipes", adminAuth, async (req, res) => {
    try {
        const result = await service.getAllRecipes();
        res.status(200).send({
            success: true,
            data: result
      });
    } catch (error) {
        console.error("RouteName: admin , Path: getAllRecipes , error message:", error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError 
        });
    }
})


router.put("/updateRecipeStatus",adminAuth, async (req, res) => {
    try {

        const recipeId =  req.body.id;
        const status =  req.body?.status;
        
        const result = await service.updateRecipeStatus(recipeId, status);
        
        res.status(200).send({success: true});

    } catch (error) {
        console.error("RouteName: admin , Path: updateRecipeStatus , error message:", error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError 
        });
    }
});


router.delete("/deleteRecipe/:id",adminAuth, async (req, res) => {
    try {
        const recipeId = req.params.id;
        const adnimId = req.body?.userId;
        
        const result = await service.deleteRecipe(recipeId, adnimId);
        
        res.status(200).send({success: true});

    } catch (error) {
        console.error("RouteName: admin , Path: deleteRecipe , error message:", error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError 
        });
    }
});


router.get("/getAllUsers",adminAuth,  async (req, res) => {
    try {
        const result = await service.getAllUsers();
        res.status(200).send({
            success: true,
            data: result
      });
    } catch (error) {
        console.error("RouteName: admin , Path: getAllUsers , error message:", error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError 
        });
    }
})


router.put("/updateUserStatus",adminAuth, async (req, res) => {
    try {

        const userId =  req.body.id;
        const status =  req.body?.status;
        
        const result = await service.updateUserStatus(userId, status);
        
        res.status(200).send({success: true});

    } catch (error) {
        console.error("RouteName: admin , Path: updateUserStatus , error message:", error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError 
        });
    }
});

module.exports = router;
