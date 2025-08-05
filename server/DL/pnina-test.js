require("dotenv").config();
require("./db.js").connect();
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const notificationService = require("../BL/notification.service.js");
const adminController = require("./controllers/admin.controller.js");
const recipeController = require("./controllers/recipe.controller.js");


const runTest = async () => {
  try {
    console.log("========= Notification Test: countUnreadNotifications =========");

    const userId = "6890f586b07387c3dd488f61";

    // 1. Create 3 unread notifications (isRead: false)
    await Promise.all([
      notificationService.addSystemNotification(userId, "Unread 1", "Message 1"),
      notificationService.addSystemNotification(userId, "Unread 2", "Message 2"),
      notificationService.addSystemNotification(userId, "Unread 3", "Message 3")
    ]);

    // 2. Create 2 read notifications manually
    const readNotifs = await Promise.all([
      notificationService.addSystemNotification(userId, "Read 1", "Read msg 1"),
      notificationService.addSystemNotification(userId, "Read 2", "Read msg 2")
    ]);

    // Mark them as read
    const readIds = readNotifs.map(n => n._id.toString());
    await notificationService.markNotificationsAsRead(readIds);

    // 3. Now test the unread counter
    const result = await notificationService.countUnreadNotifications(userId);
    console.log("Unread count result:", result); // Should be 3

    console.log("========= Notification Test Done =========\n");

  } catch (error) {
    console.error("Test error:", error);
  }
};

runTest()