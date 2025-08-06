require("dotenv").config();
require("./db.js").connect();
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const notificationService = require("../BL/notification.service.js");

const adminController = require("./controllers/admin.controller.js");
const recipeController = require("./controllers/recipe.controller.js");

const runTest = async () => {
    try {
        const userId = "6890f583b07387c3dd488f5b";
        const recipeId = "6890f588b07387c3dd488f73";

        const notificationId = await notificationService.addRecipeRatedNotification(userId, recipeId);
        console.log("Notification created successfully. ID:", notificationId);
    } catch (error) {
        console.error("Error creating notification:", error.message);
    }
};

runTest();
