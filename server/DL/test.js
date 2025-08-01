// // test/schemaBasedTest.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// // Import all controllers
const userController = require("../DL/controllers/user.controller");
const categoryController = require("../DL/controllers/category.controller");
const recipeController = require("../DL/controllers/recipe.controller");
const productController = require("../DL/controllers/product.controller");
const ratingController = require("../DL/controllers/rating.controller");
const commentController = require("../DL/controllers/comment.controller");
const savedRecipeController = require("../DL/controllers/savedRecipe.controller");
const shoppingListController = require("../DL/controllers/shoppingList.controller");
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

// Test data insertion for products
const insertProducts = async () => {
    try {
        console.log("========================= PRODUCTS TEST BEGIN =========================");
        
        const products = [
            {
                _id: new mongoose.Types.ObjectId(),
                name: "עגבניות",
                alternativeNames: ["עגבנייה", "עגבניה"],
                category: "פירות וירקות",
                defaultUnit: "קילוגרם",
                isGlobal: true,
                userId: null,
                imageUrl: "https://example.com/products/tomatoes.jpg"
            },
            {
                _id: new mongoose.Types.ObjectId(),
                name: "בצל",
                alternativeNames: ["בצלים"],
                category: "פירות וירקות",
                defaultUnit: "יחידה",
                isGlobal: true,
                userId: null,
                imageUrl: "https://example.com/products/onion.jpg"
            },
            {
                _id: new mongoose.Types.ObjectId(),
                name: "שום",
                alternativeNames: ["שן שום"],
                category: "פירות וירקות",
                defaultUnit: "יחידה",
                isGlobal: true,
                userId: null,
                imageUrl: "https://example.com/products/garlic.jpg"
            },
            {
                _id: new mongoose.Types.ObjectId(),
                name: "שמן זית",
                alternativeNames: ["שמן זית בתולי"],
                category: "שמנים",
                defaultUnit: "כף",
                isGlobal: true,
                userId: null,
                imageUrl: "https://example.com/products/olive-oil.jpg"
            },
            {
                _id: new mongoose.Types.ObjectId(),
                name: "קמח",
                alternativeNames: ["קמח לבן", "קמח רגיל"],
                category: "מוצרי מאפייה",
                defaultUnit: "כוס",
                isGlobal: true,
                userId: null,
                imageUrl: "https://example.com/products/flour.jpg"
            },
            {
                _id: new mongoose.Types.ObjectId(),
                name: "ביצים",
                alternativeNames: ["ביצה"],
                category: "חלב וביצים",
                defaultUnit: "יחידה",
                isGlobal: true,
                userId: null,
                imageUrl: "https://example.com/products/eggs.jpg"
            }
        ];
        
        for (const product of products) {
            const result = await productController.create(product);
            console.log("Product created:", result.name);
        }
        
        console.log("========================= PRODUCTS TEST END =========================\n");
        return products;
    } catch (error) {
        console.error("Products error:", error);
        throw error;
    }
};

// Test data insertion for recipes
const insertRecipes = async (users, categories, products) => {
    try {
        console.log("========================= RECIPES TEST BEGIN =========================");
        
        const mainDishCategory = categories.find(cat => cat.name === "מנות עיקריות");
        const saladCategory = categories.find(cat => cat.name === "סלטים");
        const user1 = users[0];
        const user2 = users[1];
        
        const recipes = [
            {
                _id: new mongoose.Types.ObjectId(),
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
                        productId: products.find(p => p.name === "עגבניות")._id,
                        quantity: 500,
                        unit: "גרם",
                        notes: "עגבניות בשלות"
                    },
                    {
                        productId: products.find(p => p.name === "בצל")._id,
                        quantity: 1,
                        unit: "יחידה",
                        notes: "בצל אדום עדיף"
                    },
                    {
                        productId: products.find(p => p.name === "שמן זית")._id,
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
                nutrition: {
                    calories: 85,
                    protein: 2,
                    carbs: 8,
                    fat: 6,
                    fiber: 3
                },
                viewCount: 142,
                averageRating: 4.2,
                ratingsCount: 15
            },
            {
                _id: new mongoose.Types.ObjectId(),
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
                        productId: products.find(p => p.name === "שום")._id,
                        quantity: 4,
                        unit: "יחידה",
                        notes: "שיני שום טריות"
                    },
                    {
                        productId: products.find(p => p.name === "שמן זית")._id,
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
                nutrition: {
                    calories: 420,
                    protein: 12,
                    carbs: 65,
                    fat: 14,
                    fiber: 3
                },
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
                _id: new mongoose.Types.ObjectId(),
                userId: users[1]._id,
                recipeId: recipes[0]._id,
                rating: 5,
                review: "מתכון נפלא! הסלט יצא טעים מאוד ומהיר להכנה"
            },
            {
                _id: new mongoose.Types.ObjectId(),
                userId: users[0]._id,
                recipeId: recipes[1]._id,
                rating: 4,
                review: "פסטה טעימה, הוספתי גם פטרוזיליה טרייה"
            },
            {
                _id: new mongoose.Types.ObjectId(),
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
                _id: new mongoose.Types.ObjectId(),
                userId: users[0]._id,
                recipeId: recipes[1]._id,
                folder: "מנות עיקריות",
                notes: "לנסות עם פסטה מקמח מלא"
            },
            {
                _id: new mongoose.Types.ObjectId(),
                userId: users[1]._id,
                recipeId: recipes[0]._id,
                folder: "default",
                notes: "מושלם לארוחות קיץ"
            },
            {
                _id: new mongoose.Types.ObjectId(),
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
const insertShoppingLists = async (users, products, recipes) => {
    try {
        console.log("========================= SHOPPING LISTS TEST BEGIN =========================");
        
        const shoppingLists = [
            {
                _id: new mongoose.Types.ObjectId(),
                userId: users[0]._id,
                name: "רשימת קניות לשבת",
                items: [
                    {
                        productId: products.find(p => p.name === "עגבניות")._id,
                        quantity: 1,
                        unit: "קילוגרם",
                        isPurchased: false,
                        notes: "עגבניות בשלות וטריות",
                        addedFrom: "manual",
                        recipeId: null
                    },
                    {
                        productId: products.find(p => p.name === "בצל")._id,
                        quantity: 2,
                        unit: "יחידה",
                        isPurchased: true,
                        notes: null,
                        addedFrom: "recipe",
                        recipeId: recipes[0]._id
                    },
                    {
                        productId: products.find(p => p.name === "ביצים")._id,
                        quantity: 12,
                        unit: "יחידה",
                        isPurchased: false,
                        notes: "ביצים גדולות",
                        addedFrom: "manual",
                        recipeId: null
                    }
                ],
                isActive: true,
                sharedWith: [
                    {
                        userId: users[1]._id,
                        permission: "edit"
                    }
                ],
                completedAt: null
            },
            {
                _id: new mongoose.Types.ObjectId(),
                userId: users[1]._id,
                name: "קניות חירום",
                items: [
                    {
                        productId: products.find(p => p.name === "קמח")._id,
                        quantity: 1,
                        unit: "קילוגרם",
                        isPurchased: true,
                        notes: null,
                        addedFrom: "manual",
                        recipeId: null
                    }
                ],
                isActive: false,
                sharedWith: [],
                completedAt: new Date(Date.now() - 86400000) // Yesterday
            }
        ];
        
        for (const shoppingList of shoppingLists) {
            const result = await shoppingListController.create(shoppingList);
            console.log("Shopping list created:", result.name);
        }
        
        console.log("========================= SHOPPING LISTS TEST END =========================\n");
        return shoppingLists;
    } catch (error) {
        console.error("Shopping lists error:", error);
        throw error;
    }
};

// Test data insertion for notifications
const insertNotifications = async (users, recipes) => {
    try {
        console.log("========================= NOTIFICATIONS TEST BEGIN =========================");
        
        const notifications = [
            {
                _id: new mongoose.Types.ObjectId(),
                userId: users[0]._id,
                type: "recipe_rated",
                title: "המתכון שלך קיבל דירוג חדש",
                message: "המתכון 'סלט עגבניות ובצל' קיבל דירוג של 5 כוכבים",
                relatedId: recipes[0]._id,
                isRead: false,
                isEmailSent: true
            },
            {
                _id: new mongoose.Types.ObjectId(),
                userId: users[1]._id,
                type: "recipe_approved",
                title: "המתכון שלך אושר",
                message: "המתכון 'פסטה עם שום ושמן זית' אושר ופורסם באתר",
                relatedId: recipes[1]._id,
                isRead: true,
                isEmailSent: true
            },
            {
                _id: new mongoose.Types.ObjectId(),
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
                _id: new mongoose.Types.ObjectId(),
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
                _id: new mongoose.Types.ObjectId(),
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
                _id: new mongoose.Types.ObjectId(),
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
                _id: new mongoose.Types.ObjectId(),
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
        const users = await insertUsers();
        const categories = await insertCategories();
        const products = await insertProducts();
        const recipes = await insertRecipes(users, categories, products);
        const ratings = await insertRatings(users, recipes);
        const savedRecipes = await insertSavedRecipes(users, recipes);
        const shoppingLists = await insertShoppingLists(users, products, recipes);
        const notifications = await insertNotifications(users, recipes);
        const reports = await insertReports(users, recipes);
        const adminLogs = await insertAdminLogs(users, recipes);
        
        console.log("✅ All schema-based tests completed successfully!\n");
        
        // Display summary
        console.log("📊 Database Summary:");
        console.log(`👥 Users: ${users.length}`);
        console.log(`📂 Categories: ${categories.length}`);
        console.log(`🛒 Products: ${products.length}`);
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