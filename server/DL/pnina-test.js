require("dotenv").config();
require("./db.js").connect();

const mongoose = require("mongoose");
const notificationService = require("../BL/notification.service.js");

const userController = require("./controllers/user.controller.js");
const recipeController = require("./controllers/recipe.controller.js");

const runTest = async () => {
    try {
        // Get sample user and recipe
        const users = await userController.read({});
        const recipes = await recipeController.read({});

        const user = users[0];
        const recipe = recipes[0];

        console.log("Using user:", user._id.toString());
        console.log("Using recipe:", recipe._id.toString());

        // 1. recipe_rated
        const ratedNotif = await notificationService.addRecipeRatedNotification(user._id, recipe._id);
        console.log("Rated Notification:", ratedNotif);

        // 2. recipe_commented
        const commentedNotif = await notificationService.addRecipeCommentedNotification(user._id, recipe._id);
        console.log("Commented Notification:", commentedNotif);

        // 3. recipe_approved
        const approvedNotif = await notificationService.addRecipeApprovedNotification(user._id, recipe._id);
        console.log("Approved Notification:", approvedNotif);

        // 4. recipe_rejected
        const rejectedNotif = await notificationService.addRecipeRejectedNotification(user._id, recipe._id);
        console.log("Rejected Notification:", rejectedNotif);

        // 5. system
        const systemNotif = await notificationService.addSystemNotification(
            user._id,
            "Test System Message",
            "This is a test of the system notification feature."
        );
        console.log("System Notification:", systemNotif);

    } catch (err) {
        console.error("Test failed:", err);
    } finally {
        // Close the DB connection when done
        await mongoose.disconnect();
    }
};


runTest()