const express = require('express');
const router = express.Router();
const service = require('../BL/rating.service.js');
const { auth, loginAuth } = require('../middleware/auth.js');
const ApiMessages = require('../common/apiMessages.js');

router.get("/getAll",auth, async (req, res) => {
    try {
        const recipeId = req.query.recipeId; 
        const result = await service.getAllRatings(recipeId);
         res.status(200).send({
            success: true,
            data: result
      });
    } catch (error) {
        console.error("RouteName: rating , Path: getAll , error message:", error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError 
        });
    }
});

router.post("/create",auth, async (req, res) => { // הוסף authentication
    try {   
        const ratingInput = {
            userId: req.body?.userId,
            recipeId: req.body?.recipeId,
            rating: req.body?.rating,
            review: req.body?.review
        };
        const result = await service.createRating(ratingInput);
        
        res.status(201).send({success: true, data: result});
    
    } catch (error) {
        console.error("RouteName: rating , Path: create , error message:", error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError 
        });
    }
});

router.put("/delete",auth, async (req, res) => { // הוסף authentication
    try {
        const ratingInput = {
            userId: req.body?.userId,
            ratingId: req.body?.ratingId
        };
        
        const result = await service.deleteRating(ratingInput);

        res.status(200).send({success: true});
       
    } catch (error) {
        console.error("RouteName: rating , Path: delete , error message:", error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError 
        });
    }
});

router.put("/update",auth, async (req, res) => { // הוסף authentication
    try {
        const ratingInput = {
            userId: req.body?.userId,
            recipeId: req.body?.recipeId, // הוסף ratingId
            rating: req.body?.rating,
            review: req.body?.review
        };
        const result = await service.updateRating(ratingInput);
        
        res.status(200).send({success: true});
    }  catch (error) {
        console.error("RouteName: rating , Path: update , error message:", error.message);
        res.status(500).send({
            success: false,
            message: error.message || ApiMessages.errorMessages.serverError 
        });
    }
});

module.exports = router;