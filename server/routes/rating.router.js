const express = require('express');
const router = express.Router();
const service = require('../BL/rating.service.js');
const { auth, loginAuth } = require('../middleware/auth.js');
const ApiMessages = require('../common/apiMessages.js');

router.get("/getAll", async (req, res) => {
    try {
        const recipeId = req.query.recipeId; // תוקן: racipeId -> recipeId
        const result = await service.getAllRatings(recipeId);
        
        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(400).send(result);
        }
    } catch (error) {
        console.error("Error getting ratings", error);
        res.status(500).send({
            success: false,
            message: ApiMessages.SERVER_ERROR || "Internal server error"
        });
    }
});

router.post("/create", async (req, res) => { // הוסף authentication
    try {   
        const ratingInput = {
            userId: req.body?.userId,
            recipeId: req.body?.recipeId,
            rating: req.body?.rating,
            review: req.body?.review
        };
        const result = await service.createRating(ratingInput); // תוקן: getAllRatings -> createRating
        
        if (result.success) {
            res.status(201).send(result);
        } else {
            res.status(400).send(result);
        }
    } catch (error) {
        console.error("Error creating rating", error);
        res.status(500).send({
            success: false,
            message: ApiMessages.SERVER_ERROR || "Internal server error"
        });
    }
});

router.put("/delete", async (req, res) => { // הוסף authentication
    try {
        const ratingInput = {
            userId: req.body?.userId,
            ratingId: req.body?.ratingId
        };
        
        const result = await service.deleteRating(ratingInput);
        
        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(400).send(result);
        }
    } catch (error) {
        console.error("Error deleting rating", error);
        res.status(500).send({
            success: false,
            message: ApiMessages.SERVER_ERROR || "Internal server error"
        });
    }
});

router.put("/update", async (req, res) => { // הוסף authentication
    try {
        const ratingInput = {
            userId: req.body?.userId,
            recipeId: req.body?.recipeId, // הוסף ratingId
            rating: req.body?.rating,
            review: req.body?.review
        };
        const result = await service.updateRating(ratingInput);
        
        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(400).send(result);
        }
    } catch (error) {
        console.error("Error updating rating", error);
        res.status(500).send({
            success: false,
            message: ApiMessages.SERVER_ERROR || "Internal server error"
        });
    }
});

module.exports = router;