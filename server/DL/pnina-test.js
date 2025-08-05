require("dotenv").config();
require("./db.js").connect();
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const notificationService = require("../BL/notification.service.js");
const adminController = require("./controllers/admin.controller.js");
const recipeController = require("./controllers/recipe.controller.js");


const runTest = async () => {
  console.log("=== addRecipeRatedNotification Test ===");

  // Setup: Create fake admin and recipe
  const admin = await adminController.create({
    username: "testadmin",
    email: "testadmin@example.com",
    passwordHash: await bcrypt.hash("123456", 10),
    firstName: "Test",
    lastName: "Admin"
  });

  const recipe = await recipeController.readOne({ _id: mongoose.Types.ObjectId(6890f583b07387c3dd488f5b) }); });

  const validUserId = admin._id.toString();
  const validRecipeId = recipe._id.toString();

  // ✅ GOOD CASE
  try {
    const notificationId = await notificationService.addRecipeRatedNotification(validUserId, validRecipeId);
    console.log("✅ Success: Created notification with ID:", notificationId);
  } catch (error) {
    console.error("❌ Failed good case:", error.message);
  }

  // ❌ MISSING FIELDS
  try {
    await notificationService.addRecipeRatedNotification(null, validRecipeId);
  } catch (error) {
    console.log("✅ Missing userId caught:", error.message);
  }

  try {
    await notificationService.addRecipeRatedNotification(validUserId, null);
  } catch (error) {
    console.log("✅ Missing recipeId caught:", error.message);
  }

  // ❌ INVALID OBJECTID FORMAT
  try {
    await notificationService.addRecipeRatedNotification("invalidUserId", validRecipeId);
  } catch (error) {
    console.log("✅ Invalid userId format caught:", error.message);
  }

  try {
    await notificationService.addRecipeRatedNotification(validUserId, "invalidRecipeId");
  } catch (error) {
    console.log("✅ Invalid recipeId format caught:", error.message);
  }

  console.log("=== Test Done ===");
};

runTest()