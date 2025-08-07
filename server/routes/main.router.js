const express = require('express');
const router = express.Router();
const userService = require('../BL/user.service.js');
const { auth, loginAuth } = require('../middleware/auth.js');
const recipeService = require('../BL/recipe.service.js');
const notificationService = require('../BL/notification.service.js');
const ApiMessages = require('../common/apiMessages.js');


router.get('/',auth, async (req, res) => {
    try {
        const userId = req.body.userId
        const data = {
            user: await userService.getUser(userId),
            recipes: await recipeService.getAllRecipes(),
            notification: await notificationService.countUnreadNotifications(),
        }
       res.status(200).send({success: true, data});
    } catch (error) {
        console.error("RouteName: user : getUserData : error message:", error.message);
        res.status(500).send({ registered: false, message: error.message || ApiMessages.errorMessages.serverError });
    }
}); 

module.exports = router;
