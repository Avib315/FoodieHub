const adminController = require("../DL/controllers/admin.controller.js");
const recipeController = require("../DL/controllers/recipe.controller.js");
const userController = require("../DL/controllers/user.controller.js");
const SavedRecipeService = require("./savedRecipe.service.js");
const activityNotifierService = require("./activityNotifier.service.js");
const adminLogService = require("./adminLog.service.js");
const bcrypt = require('bcrypt');
const { loginAdminAuth } = require("../middleware/auth.js");
const ApiMessages = require("../common/apiMessages.js");

async function login(adminInput) {
    if (!adminInput || !adminInput.email || !adminInput.email.trim() ||
        !adminInput.password || adminInput.password.trim() === '') {
        console.log("function login: Missing required fields: email or password");
        
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminInput.email.trim())) {
        console.log("function login: Invalid email format provided");
        throw new Error(ApiMessages.errorMessages.invalidEmail);
    }

    if (adminInput.password.length < 6) {
        console.log("function login: Password too weak, must be at least 6 characters");
        throw new Error(ApiMessages.errorMessages.passwordTooWeak);
    }

    const admin = await adminController.readOne({ email: adminInput.email });

    if (!admin) {
        console.log("function login: Admin not found with the provided email");
         throw new Error(ApiMessages.errorMessages.userNotFound); }
    const passwordMatch = await bcrypt.compare(adminInput.password, admin?.passwordHash);
    if (!passwordMatch) {
        console.log("function login: Invalid credentials provided");
         throw new Error(ApiMessages.errorMessages.invalidCredentials); }

    const token = loginAdminAuth({ id: admin._id });

    if (!token) {
        console.log("function login: Failed to generate authentication token");
        throw new Error(ApiMessages.errorMessages.serverError);
    }
    return {
        token,
        admin: {
            username: admin.username,
            email: admin.email,
            firstName: admin.firstName,
            lastName: admin.lastName
        }
    };
}

//// action

async function getAllRecipes() {
    // שליפת המתכונים
    const recipes = await recipeController.readWithUserAndRatings();

    // בדיקה אם יש מתכונים (אבל לא זורקים שגיאה, זה מצב תקין)
    if (!recipes || recipes.length === 0) {
        return {
            data: []
        };
    }
    return recipes;
}



const updateRecipeStatus = async (recipeId, status) => {
    // ולידציות בסיסיות במשולב
    if (!recipeId || !status) {
        log("function updateRecipeStatus: Missing required fields: recipeId or status");
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    // ולידציה של פורמט ObjectId
    if (!recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        log("function updateRecipeStatus: Invalid recipeId format provided");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // ולידציה של הסטטוס
    const validStatuses = ['active', 'pending', 'rejected', 'draft'];
    if (!validStatuses.includes(status)) {
        log("function updateRecipeStatus: Invalid status provided");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // בדיקה שהמתכון קיים
    const existingRecipe = await recipeController.readOne({ _id: recipeId });
    if (!existingRecipe) {
        log("function updateRecipeStatus: Recipe not found with the provided ID");
        throw new Error(ApiMessages.errorMessages.notFound);
    }

    // בדיקה אם הסטטוס כבר זהה
    if (existingRecipe.status === status) {
        log("function updateRecipeStatus: Recipe already has the requested status");
        throw new Error(ApiMessages.errorMessages.conflict);
    }

    // עדכון הסטטוס
    const updatedRecipe = await recipeController.update(
        { _id: recipeId },
        { status: status }
    );

    if (!updatedRecipe) {
        log("function updateRecipeStatus: Failed to update recipe status");
        throw new Error(ApiMessages.errorMessages.updateFailed);
    }


    if (status === 'rejected' || status === 'active') {
        await activityNotifierService.notifyRecipeStatus(recipeId, status);
    }

    return {
        data: {
            recipeId: recipeId,
            oldStatus: existingRecipe.status,
            newStatus: status,
            title: existingRecipe.title
        }
    };
};



const deleteRecipe = async (recipeId, adnimId) => {
    // ولידציות בסיסיות במשולב
    if (!recipeId || !adnimId) {
        log("function deleteRecipe: Missing required fields: recipeId or adnimId");
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    // ولידציות פורמט ObjectId במשולב
    if (!recipeId.match(/^[0-9a-fA-F]{24}$/) || !adnimId.match(/^[0-9a-fA-F]{24}$/)) {
        log("function deleteRecipe: Invalid recipeId or adnimId format provided");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // בדיקה שהמתכון קיים
    const existingRecipe = await recipeController.readOne({ _id: recipeId });
    if (!existingRecipe) {
        log("function deleteRecipe: Recipe not found with the provided ID");
        throw new Error(ApiMessages.errorMessages.notFound);
    }

    // מחיקת המתכון מכל המשתמשים ששמרו אותו
    try {
        // שליפת כל המשתמשים ששמרו את המתכון
        const usersWithSavedRecipe = await userController.read({
            savedRecipes: recipeId
        });

        // מחיקת המתכון מכל המשתמשים שמרו אותו
        if (usersWithSavedRecipe && usersWithSavedRecipe.length > 0) {
            await Promise.all(
                usersWithSavedRecipe.map(async (user) => {
                    try {
                        await SavedRecipeService.removeSavedRecipe(user._id.toString(), recipeId);


                    } catch (error) {
                        log(`Error removing saved recipe ${recipeId} from user ${user._id}:`, error.message);
                        throw new Error(`Failed to remove saved recipe ${recipeId} from user ${user._id}:`, error.message);
                    }
                })
            );
        }
    } catch (error) {
        log(`Error removing recipe ${recipeId} from saved lists:`, error.message);
        throw new Error(`Error removing recipe ${recipeId} from saved lists:`, error.message);
    }

    // מחיקת המתכון עצמו
    const deletedRecipe = await recipeController.del({ _id: recipeId });

    if (!deletedRecipe) {
        log("function deleteRecipe: Failed to delete recipe");
        throw new Error(ApiMessages.errorMessages.deletionFailed);
    }

    await adminLogService.createLog({
        action: 'recipe_deleted',
        targetType: 'recipe',
        targetId: recipeId
    });

    return {
        data: { id: recipeId },
        message: ApiMessages.successMessages.dataDeleted
    };
};



const getAllUsers = async () => {
    // שליפת כל המשתמשים
    const users = await userController.read({});

    // אם אין משתמשים
    if (!users || users.length === 0) {
        return [];
    }

    // עיבוד המשתמשים - הסרת סיסמאות והכנת נתונים נקיים
    const safeUsers = users.map(user => {
        // המרה לאובייקט רגיל (אם Mongoose document)
        const userObj = user.toObject ? user.toObject() : { ...user };

        // הסרת הסיסמה
        const { passwordHash, ...safeUser } = userObj;

        // הוספת שם מלא
        safeUser.fullName = `${userObj.firstName} ${userObj.lastName}`;

        return safeUser;
    });

    return safeUsers;
};


const updateUserStatus = async (userId, status) => {
    // ولידציות בסיסיות במשולב
    if (!userId || !status) {
        log("function updateUserStatus: Missing required fields: userId or status");
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    // ולידציה של פורמט ObjectId
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        log("function updateUserStatus: Invalid userId format provided");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // ולידציה של הסטטוס
    const validStatuses = ['active', 'blocked', 'inactive'];
    if (!validStatuses.includes(status)) {
        log("function updateUserStatus: Invalid status provided");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // בדיקה שהמשתמש קיים
    const existingUser = await userController.readOne({ _id: userId });
    if (!existingUser) {
        log("function updateUserStatus: User not found with the provided ID");
        throw new Error(ApiMessages.errorMessages.userNotFound);
    }

    // בדיקה אם הסטטוס כבר זהה
    if (existingUser.status === status) {
        log("function updateUserStatus: User already has the requested status");
        throw new Error(ApiMessages.errorMessages.conflict);
    }

    // עדכון הסטטוס
    const updatedUser = await userController.update(
        { _id: userId },
        { status: status }
    );

    if (!updatedUser) {
        log("function updateUserStatus: Failed to update user status");
        throw new Error(ApiMessages.errorMessages.updateFailed);
    }

    if (status === 'blocked' || status === 'inactive') {
        await adminLogService.createLog({
            action: 'user_blocked',
            targetType: 'user',
            targetId: userId
        });
    }

    if (status === 'active') {
        await adminLogService.createLog({
            action: 'user_unblocked',
            targetType: 'user',
            targetId: userId
        });
    }

    // if (status === 'inactive') {}

    return {
        data: {
            userId: userId,
            oldStatus: existingUser.status,
            newStatus: status,
            username: existingUser.username,
            email: existingUser.email
        }
    };
};


module.exports = { login, getAllRecipes, deleteRecipe, getAllUsers, updateRecipeStatus, updateUserStatus };