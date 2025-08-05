require("dotenv").config();
require("./db.js").connect();
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const notificationService = require("../BL/notification.service.js");

const adminController = require("./controllers/admin.controller.js");
const recipeController = require("./controllers/recipe.controller.js");

const runTest = async () => {
    const hashedPassword = await bcrypt.hash("123456", 10);
    console.log("Hashed password:", hashedPassword);
    const admin = await adminController.create({
        username: "aviTheBoss",
        email: "avi@a.com",
        passwordHash: hashedPassword,
        firstName: "Avi",
        lastName: "TheBoss",
    }  );
    
    console.log("admin created:", admin);
}


runTest()