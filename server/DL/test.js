// // test/schemaBasedTest.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// // Import all controllers
const userController = require("../DL/controllers/user.controller");
const categoryController = require("../DL/controllers/category.controller");
const recipeController = require("../DL/controllers/recipe.controller");
const ratingController = require("../DL/controllers/rating.controller");
const commentController = require("../DL/controllers/comment.controller");
const savedRecipeController = require("../DL/controllers/savedRecipe.controller");
const reportController = require("../DL/controllers/report.controller");
const adminLogController = require("../DL/controllers/adminLog.controller");
const notificationController = require("../DL/controllers/notification.controller");

require("dotenv").config();
require("./db.js").connect();

// Test data insertion for users
const insertUsers = async () => {
   try {
        console.log("========================= USERS TEST BEGIN =========================");
        const hashedPassword = await bcrypt.hash("123456", 10);
        console.log("Hashed password:", hashedPassword);

        const users = [
            {
                username: "avi_hershkovitz",
                email: "avi@example.com",
                passwordHash: hashedPassword, // Should be properly hashed in real app
                firstName: "אבי",
                lastName: "הרשקוביץ",
                role: "user",
                status: "active",
                profileImageUrl: "https://example.com/profiles/yossi.jpg",
                lastLogin: new Date()
            },
            {
                username: "coral286",
                email: "admin1@example.com",
                passwordHash:hashedPassword,
                firstName: "קורל",
                lastName: "שמואלוביץ",
                role: "admin",
                status: "active",
                profileImageUrl: "https://example.com/profiles/admin.jpg",
                lastLogin: new Date()
            },
            {
                username: "pnina",
                email: "pnina@example.com",
                passwordHash:hashedPassword,
                firstName: "פנינה",
                lastName: "כהן",
                role: "user",
                status: "active",
                profileImageUrl: "https://example.com/profiles/admin.jpg",
                lastLogin: new Date()
            }
        ];
        
        for (const user of users) {
            const result = await userController.create(user);
            console.log("User created:", result.username);
        }
        
        console.log("========================= USERS TEST END =========================\n");
        return users;
    } catch (error) {
        console.error("Users error:", error);
        throw error;
    }
};

// Test data insertion for categories
const insertCategories = async () => {
    try {
        console.log("========================= CATEGORIES TEST BEGIN =========================");
        
        const categories = [
            {
                name: "מנות עיקריות",
                description: "מנות עיקריות לארוחה",
                iconUrl: "https://urimalka.co.il/wp-content/uploads/2019/08/WhatsApp-Image-2019-08-29-at-11.33.16.jpeg",
                sortOrder: 1,
                isActive: true,
                recipeCount: 0
            },
            {
                name: "מתאבנים",
                description: "מתאבנים וכניסות",
                iconUrl: "https://cdn.babamail.co.il/images/recipes_source/ba530703-bbb5-492e-b921-ce5223d2d1d9.jpg",
                sortOrder: 2,
                isActive: true,
                recipeCount: 0
            },
            {
                name: "קינוחים",
                description: "קינוחים וממתקים",
                iconUrl: "https://www.metukimsheli.com/wp-content/uploads/2023/07/%D7%91%D7%95%D7%9E%D7%91-%D7%A9%D7%95%D7%A7%D7%95%D7%9C%D7%93-%D7%9E%D7%99%D7%9C%D7%A7%D7%948-1000x1400.jpg",
                sortOrder: 3,
                isActive: true,
                recipeCount: 0
            },
            {
                name: "מרקים",
                description: "מרקים חמים וקרים",
                iconUrl: "https://www.shfayimcenter.co.il/wp-content/uploads/2019/11/%D7%A7%D7%A8%D7%95%D7%A1%D7%9C%D7%AA-%D7%9E%D7%A8%D7%A7%D7%99%D7%9D4.jpg",
                sortOrder: 4,
                isActive: true,
                recipeCount: 0
            },
            {
                name: "סלטים",
                description: "סלטים טריים ובריאים",
                iconUrl: "https://veg-new.b-cdn.net/wp-content/uploads/salads.jpg",
                sortOrder: 5,
                isActive: true,
                recipeCount: 0
            },
            {
                name: "משקאות",
                description: "משקאות חמים וקרים",
                iconUrl: "https://www.paskovich.co.il/Warehouse/content/pics/pic_1220_A.jpg",
                sortOrder: 6,
                isActive: true,
                recipeCount: 0
            }
        ];
        
        for (const category of categories) {
            const result = await categoryController.create(category);
            console.log("Category created:", result.name);
        }
        
        console.log("========================= CATEGORIES TEST END =========================\n");
        return categories;
    } catch (error) {
        console.error("Categories error:", error);
        throw error;
    }
};


// Test data insertion for recipes
const insertRecipes = async (users, categories) => {
    try {
        console.log("========================= RECIPES TEST BEGIN =========================");
        
        const mainDishCategory = categories.find(cat => cat.name === "מנות עיקריות");
        const saladCategory = categories.find(cat => cat.name === "סלטים");
        const user1 = users[0];
        const user2 = users[1];

        
        const recipes = [
            {
                userId: user1._id,
                categoryId: saladCategory._id,
                title: "סלט עגבניות ובצל",
                description: "סלט פשוט וטעים עם עגבניות ובצל טרי",
                instructions: [
                    {
                        stepNumber: 1,
                        text: "חתכו את העגבניות לקוביות בינוניות",
                        imageUrl: "https://example.com/steps/step1.jpg"
                    },
                    {
                        stepNumber: 2,
                        text: "חתכו את הבצל לפרוסות דקות",
                        imageUrl: null
                    },
                    {
                        stepNumber: 3,
                        text: "ערבבו הכל עם שמן זית ומלח",
                        imageUrl: null
                    }
                ],
                ingredients: [
                    {
                        name:"עגבניות",
                        quantity: 500,
                        unit: "גרם",
                        notes: "עגבניות בשלות"
                    },
                    {
                        name:"בצל",
                        quantity: 1,
                        unit: "יחידה",
                        notes: "בצל אדום עדיף"
                    },
                    {
                        name:"שמן זית",
                        quantity: 2,
                        unit: "כף",
                        notes: null
                    }
                ],
                prepTime: 15,
                cookTime: 0,
                servings: 4,
                difficultyLevel: 1,
                imageUrl: "https://example.com/recipes/tomato-salad.jpg",
                images: [
                    {
                        url: "https://example.com/recipes/tomato-salad.jpg",
                        caption: "סלט עגבניות מוכן להגשה",
                        isPrimary: true
                    }
                ],
                tags: ["סלט", "טבעוני", "קל", "מהיר"],
                isPublic: true,
                status: "active",
                viewCount: 142,
                averageRating: 4.2,
                ratingsCount: 15
            },
            {
                userId: user2._id,
                categoryId: mainDishCategory._id,
                title: "פסטה עם שום ושמן זית",
                description: "מנה איטלקית קלאסית וטעימה",
                instructions: [
                    {
                        stepNumber: 1,
                        text: "בשלו את הפסטה במים רותחים",
                        imageUrl: null
                    },
                    {
                        stepNumber: 2,
                        text: "חתכו את השום דק והקפיצו בשמן זית",
                        imageUrl: null
                    },
                    {
                        stepNumber: 3,
                        text: "ערבבו את הפסטה עם השום והשמן",
                        imageUrl: null
                    }
                ],
                ingredients: [
                    {
                        name:"שום",
                        quantity: 4,
                        unit: "יחידה",
                        notes: "שיני שום טריות"
                    },
                    {
                        name:"שמן זית",
                        quantity: 4,
                        unit: "כף",
                        notes: "שמן זית איכותי"
                    }
                ],
                prepTime: 10,
                cookTime: 15,
                servings: 2,
                difficultyLevel: 2,
                imageUrl: "https://example.com/recipes/pasta-aglio.jpg",
                images: [
                    {
                        url: "https://example.com/recipes/pasta-aglio.jpg",
                        caption: "פסטה עם שום ושמן זית",
                        isPrimary: true
                    }
                ],
                tags: ["פסטה", "איטלקי", "מהיר", "צמחוני"],
                isPublic: true,
                status: "active",
                viewCount: 89,
                averageRating: 4.7,
                ratingsCount: 8
            }
        ];
        
        for (const recipe of recipes) {
            const result = await recipeController.create(recipe);
            console.log("Recipe created:", result.title);
        }
        
        console.log("========================= RECIPES TEST END =========================\n");
        return recipes;
    } catch (error) {
        console.error("Recipes error:", error);
        throw error;
    }
};

// Test data insertion for ratings
const insertRatings = async (users, recipes) => {
    try {
        console.log("========================= RATINGS TEST BEGIN =========================");
        
        const ratings = [
            {
                userId: users[1]._id,
                recipeId: recipes[0]._id,
                rating: 5,
                review: "מתכון נפלא! הסלט יצא טעים מאוד ומהיר להכנה"
            },
            {
                userId: users[0]._id,
                recipeId: recipes[1]._id,
                rating: 4,
                review: "פסטה טעימה, הוספתי גם פטרוזיליה טרייה"
            },
            {
                userId: users[2]._id,
                recipeId: recipes[0]._id,
                rating: 4,
                review: "סלט פשוט ונפלא לארוחת ערב קלה"
            }
        ];
        
        for (const rating of ratings) {
            const result = await ratingController.create(rating);
            console.log("Rating created for recipe:", rating.recipeId);
        }
        
        console.log("========================= RATINGS TEST END =========================\n");
        return ratings;
    } catch (error) {
        console.error("Ratings error:", error);
        throw error;
    }
};

// Test data insertion for saved recipes
const insertSavedRecipes = async (users, recipes) => {
    try {
        console.log("========================= SAVED RECIPES TEST BEGIN =========================");
        
        const savedRecipes = [
            {
                userId: users[0]._id,
                recipeId: recipes[1]._id,
                folder: "מנות עיקריות",
                notes: "לנסות עם פסטה מקמח מלא"
            },
            {
                userId: users[1]._id,
                recipeId: recipes[0]._id,
                folder: "default",
                notes: "מושלם לארוחות קיץ"
            },
            {
                userId: users[2]._id,
                recipeId: recipes[0]._id,
                folder: "קלים ומהירים",
                notes: null
            }
        ];
        
        for (const savedRecipe of savedRecipes) {
            const result = await savedRecipeController.create(savedRecipe);
            console.log("Saved recipe created for user:", savedRecipe.userId);
        }
        
        console.log("========================= SAVED RECIPES TEST END =========================\n");
        return savedRecipes;
    } catch (error) {
        console.error("Saved recipes error:", error);
        throw error;
    }
};

// Test data insertion for shopping lists

// Test data insertion for notifications
const insertNotifications = async (users, recipes) => {
    try {
        console.log("========================= NOTIFICATIONS TEST BEGIN =========================");
        
        const notifications = [
            {
                userId: users[0]._id,
                type: "recipe_rated",
                title: "המתכון שלך קיבל דירוג חדש",
                message: "המתכון 'סלט עגבניות ובצל' קיבל דירוג של 5 כוכבים",
                relatedId: recipes[0]._id,
                isRead: false,
                isEmailSent: true
            },
            {
                userId: users[1]._id,
                type: "recipe_approved",
                title: "המתכון שלך אושר",
                message: "המתכון 'פסטה עם שום ושמן זית' אושר ופורסם באתר",
                relatedId: recipes[1]._id,
                isRead: true,
                isEmailSent: true
            },
            {
                userId: users[0]._id,
                type: "system",
                title: "ברוכים הבאים לאתר המתכונים",
                message: "תודה על ההצטרפות! כאן תוכלו למצוא מתכונים נפלאים ולשתף את שלכם",
                relatedId: null,
                isRead: false,
                isEmailSent: false
            }
        ];
        
        for (const notification of notifications) {
            const result = await notificationController.create(notification);
            console.log("Notification created:", notification.title);
        }
        
        console.log("========================= NOTIFICATIONS TEST END =========================\n");
        return notifications;
    } catch (error) {
        console.error("Notifications error:", error);
        throw error;
    }
};

// Test data insertion for reports
const insertReports = async (users, recipes) => {
    try {
        console.log("========================= REPORTS TEST BEGIN =========================");
        
        const reports = [
            {
                reportedBy: users[1]._id,
                targetType: "recipe",
                targetId: recipes[0]._id,
                reason: "inappropriate_content",
                description: "יש כאן תמונה לא מתאימה במתכון",
                status: "pending",
                adminResponse: {
                    adminId: null,
                    action: null,
                    notes: null,
                    reviewedAt: null
                }
            },
            {
                reportedBy: users[0]._id,
                targetType: "user",
                targetId: users[1]._id,
                reason: "spam",
                description: "המשתמש מפרסם מתכונים זהים מספר פעמים",
                status: "reviewed",
                adminResponse: {
                    adminId: users[2]._id,
                    action: "warning",
                    notes: "נשלחה אזהרה למשתמש",
                    reviewedAt: new Date(Date.now() - 3600000) // 1 hour ago
                }
            }
        ];
        
        for (const report of reports) {
            const result = await reportController.create(report);
            console.log("Report created for:", report.targetType);
        }
        
        console.log("========================= REPORTS TEST END =========================\n");
        return reports;
    } catch (error) {
        console.error("Reports error:", error);
        throw error;
    }
};

// Test data insertion for admin logs
const insertAdminLogs = async (users, recipes) => {
    try {
        console.log("========================= ADMIN LOGS TEST BEGIN =========================");
        
        const adminLogs = [
            {
                adminId: users[2]._id, // Admin user
                action: "recipe_approved",
                targetType: "recipe",
                targetId: recipes[0]._id,
                details: {
                    recipeName: "סלט עגבניות ובצל",
                    previousStatus: "pending",
                    newStatus: "active"
                },
                ipAddress: "192.168.1.100",
                userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            },
            {
                adminId: users[2]._id,
                action: "user_blocked",
                targetType: "user",
                targetId: users[1]._id,
                details: {
                    userName: "miriam_levi",
                    reason: "Multiple spam reports",
                    duration: "7 days"
                },
                ipAddress: "192.168.1.100",
                userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        ];
        
        for (const adminLog of adminLogs) {
            const result = await adminLogController.create(adminLog);
            console.log("Admin log created:", adminLog.action);
        }
        
        console.log("========================= ADMIN LOGS TEST END =========================\n");
        return adminLogs;
    } catch (error) {
        console.error("Admin logs error:", error);
        throw error;
    }
};

// Main test function
const runCompleteTest = async () => {
    try {
        console.log("🚀 Starting complete database test based on schema...\n");
        
        // Insert data in correct order (dependencies)
        const users1 = await insertUsers();
        const categories1 = await insertCategories();
        const users = await userController.read({})
        const categories = await categoryController.read({})        
        const recipes1 = await insertRecipes(users, categories);
        const recipes = await recipeController.read({})
        const ratings = await insertRatings(users, recipes);
        const savedRecipes = await insertSavedRecipes(users, recipes);
        const notifications = await insertNotifications(users, recipes);
        const reports = await insertReports(users, recipes);
        const adminLogs = await insertAdminLogs(users, recipes);
        const comments = await insertComments();
        
        console.log("✅ All schema-based tests completed successfully!\n");
        
        // Display summary
        console.log("📊 Database Summary:");
        console.log(`👥 Users: ${users.length}`);
        console.log(`📂 Categories: ${categories.length}`);
        console.log(`📖 Recipes: ${recipes.length}`);
        console.log(`⭐ Ratings: ${ratings.length}`);
        console.log(`💾 Saved Recipes: ${savedRecipes.length}`);
        console.log(`📝 Shopping Lists: ${shoppingLists.length}`);
        console.log(`🔔 Notifications: ${notifications.length}`);
        console.log(`📢 Reports: ${reports.length}`);
        console.log(`📋 Admin Logs: ${adminLogs.length}`);
        
    } catch (error) {
        console.error("❌ Complete test failed:", error);
    }
};

// Test data insertion for comments
const insertComments = async () => {
    try {
        console.log("========================= COMMENTS TEST BEGIN =========================");

        const users = await userController.read({})
        const user1 = users[0];
        const user2 = users[1];

        const recipes = await recipeController.read({})
        const recipe1 = recipes[0];
        const recipe2 = recipes[1];
        
        const comments = [
            {
                userId: user1._id,
                recipeId: recipe1._id,
                content: "This recipe was amazing! I added extra garlic and it turned out perfect.",
                status: "active"
            },
            {
                userId: user2._id,
                recipeId: recipe1._id,
                content: "Good base recipe, but Id recommend baking it a bit longer for a crispier texture.",
                status: "active",
                isEdited: true,
                editedAt: new Date()
            },
            {
                userId: user1._id,
                recipeId: recipe2._id,
                content: "Didnt love it. It was a bit bland for my taste.",
                status: "hidden"
            },
            {
                userId: user2._id,
                recipeId: recipe2._id,
                content: "Absolutely delicious. Ill be making this again next weekend!",
                status: "active"
            },
            {
                userId: user2._id,
                recipeId: recipe1._id,
                content: "Deleted my old review. Just wanted to say thanks for the great recipe!",
                status: "deleted",
                isEdited: true,
                editedAt: new Date()
            }
        ];

        for (const comment of comments) {
            const result = await commentController.create(comment);
            
            console.log("Comment created:", result.content);
        }
        
        console.log("========================= COMMENTS TEST END =========================\n");
        return comments;
    } catch (error) {
        console.error("Comments error:", error);
        throw error;
    }
};

// Run the complete test
runCompleteTest();


// const insertUsers = async () => {
//     try {
//         console.log("========================= USERS TEST BEGIN =========================");
//         const hashedPassword = await bcrypt.hash("123456", 10);
//         console.log("Hashed password:", hashedPassword);

//         const users = [
//             {
//                 username: "avi_hershkovitz",
//                 email: "avi@example.com",
//                 passwordHash: hashedPassword, // Should be properly hashed in real app
//                 firstName: "אבי",
//                 lastName: "הרשקוביץ",
//                 role: "user",
//                 status: "active",
//                 profileImageUrl: "https://example.com/profiles/yossi.jpg",
//                 lastLogin: new Date()
//             },
//             {
//                 username: "coral286",
//                 email: "admin1@example.com",
//                 passwordHash:hashedPassword,
//                 firstName: "קורל",
//                 lastName: "שמואלוביץ",
//                 role: "admin",
//                 status: "active",
//                 profileImageUrl: "https://example.com/profiles/admin.jpg",
//                 lastLogin: new Date()
//             }
//         ];
        
//         for (const user of users) {
//             const result = await userController.create(user);
//             console.log("User created:", result.username);
//         }
        
//         console.log("========================= USERS TEST END =========================\n");
//         return users;
//     } catch (error) {
//         console.error("Users error:", error);
//         throw error;
//     }
// };
// insertUsers()