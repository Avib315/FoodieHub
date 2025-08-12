const recipeController = require("../DL/controllers/recipe.controller.js");
const userController = require("../DL/controllers/user.controller.js");
const ratingService = require("./rating.service.js");
const commentService = require("./comment.service.js");
const adminLogService = require("./adminLog.service.js");
const ApiMessages = require("../common/apiMessages.js");
const cloudinaryService = require('../imageServer/cloudinary.service.js');
const savedRecipeController = require("../DL/controllers/savedRecipe.controller.js");

async function getAllRecipes(filterByActive = true, userId) {
    // ולידציה של הפרמטר
    if (typeof filterByActive !== 'boolean') {
        console.log("getAllRecipes: filterByActive should be a boolean");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // שליפת המתכונים
    const recipes = await recipeController.readWithUserAndRatings();

    // בדיקה אם יש מתכונים (אבל לא זורקים שגיאה, זה מצב תקין)
    if (!recipes || recipes.length === 0) {
        return []
    }

    let sendRecipes = [...recipes];

    if (userId) {
        const user = await userController.readOne({ _id: userId });

        if (user) {
            const savedRecipes = user.savedRecipes || [];
            const savedRecipeIds = new Set(savedRecipes.map(recipe => recipe._id.toString()));

            sendRecipes = sendRecipes.map(recipe => ({
                ...recipe,
                saved: savedRecipeIds.has(recipe._id.toString())
            }));
        } else {
            console.log("getAllRecipes: user not found");
            sendRecipes = sendRecipes.map(recipe => ({
                ...recipe,
                saved: false
            }));
        }
    }

    // סינון המתכונים על פי הסטטוס אם נדרש
    const filteredRecipes = filterByActive
        ? sendRecipes.filter(recipe => recipe.status === 'active')
        : sendRecipes;

    return filteredRecipes;
}

async function getRecipeById(id, currentUserId = null) {
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("getRecipeById: Invalid or missing recipe ID");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // שליפת המתכון
    const recipe = await recipeController.readOne({ _id: id });
    if (!recipe) {
        console.log("getRecipeById: Recipe not found");
        throw new Error(ApiMessages.errorMessages.notFound);
    }

    // ביצוע כל השליפות במקביל
    const promises = [
        // Get recipe creator info
        recipe.userId ? userController.readOne({ _id: recipe.userId }) : Promise.resolve(null),
        // Get ratings
        ratingService.getAllRatings(id),
        // Get comments
        commentService.getRecipeComments(id).catch(() => [])
    ];

    // If we have a current user, also get their info to check saved recipes
    if (currentUserId) {
        promises.push(userController.readOne({ _id: currentUserId }));
    }

    const results = await Promise.all(promises);
    const [recipeCreator, ratingResult, comments] = results;



    // עיבוד התוצאות
    const userName = recipeCreator?.username || 'Unknown User';
    const fullName = recipeCreator?.firstName + " " + recipeCreator?.lastName || 'Unknown User';
    const averageRating = ratingResult.data.averageRating;
    const totalRatings = ratingResult.data.totalCount;
    const currentUser = await userController.readOne({ _id: currentUserId })
    // המרה לאובייקט רגיל ומחיקת userId
    const recipeObj = recipe.toObject();

    // Check if CURRENT USER has saved this recipe (not the recipe creator!)
    let isSaved = false;
    if (currentUser && currentUser.savedRecipes) {
        const savedRecipeIds = currentUser.savedRecipes || [];
        const savedRecipeIdsSet = new Set(savedRecipeIds.map(recipe => recipe._id.toString()));
        isSaved = savedRecipeIdsSet.has(recipeObj._id.toString());
        if (ratingResult) {
            // check if the current user has rated this recipe here // userId = currentUserId
            console.log(ratingResult.data.ratings);

            const ratedByMe = ratingResult.data.ratings.some(rating =>
                rating.userId.toString() === currentUserId.toString()
            );

            recipeObj.ratedByMe = ratedByMe;
        }
    }

    recipeObj.saved = isSaved;
    const { userId, ...recipeWithoutUserId } = recipeObj;

    // החזרת המתכון עם הנתונים הנוספים
    return {
        ...recipeWithoutUserId,
        userName: userName,
        fullName: fullName,
        averageRating: averageRating,
        ratingsCount: totalRatings,
        comments: comments,
        saved: isSaved
    };
}

const createRecipe = async (recipeInput) => {
    // בדיקת קיום האובייקט
    if (!recipeInput) {
        console.log("createRecipe: Missing required recipeInput object");
        throw new Error(ApiMessages.errorMessages.badRequest);
    }
    const {
        userId,
        category,
        title,
        description,
        instructions,
        ingredients,
        prepTime,
        servings,
        difficultyLevel,
        image
    } = recipeInput;
    if (!image) {
        console.log("createRecipe: Missing required field: image");
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }


    await cloudinaryService.connect();

    // Upload image using the file path
    const imageResult = await cloudinaryService.uploadImage(image.path, "recipesImages");
    if (!imageResult || !imageResult.url) {
        console.log("createRecipe: Image upload failed");
        throw new Error(ApiMessages.errorMessages.imageUploadFailed);
    }

    // ולידציות בסיסיות במשולב
    if (!userId || !category || !title || !description || !instructions ||
        !ingredients || prepTime === undefined || servings === undefined ||
        difficultyLevel === undefined) {
        console.log("createRecipe: Missing required fields");
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    // ולידציות פורמט ObjectId במשולב
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("createRecipe: Invalid userId format provided");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    if (category !== undefined) {
        const validCategories = ['main', 'appetizer', 'soup', 'salad', 'dessert', 'drink'];
        if (!validCategories.includes(category)) {
            console.log("createRecipe: Invalid category provided");
            throw new Error(ApiMessages.errorMessages.invalidData);
        }
    }

    // ולידציות מערכים במשולב
    if (!Array.isArray(instructions) || instructions.length === 0 ||
        !Array.isArray(ingredients) || ingredients.length === 0) {
        console.log("createRecipe: Instructions and ingredients must be non-empty arrays");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // ולידציות ערכים מספריים במשולב
    if (prepTime < 0 || servings < 1 || difficultyLevel < 1 || difficultyLevel > 5) {
        console.log("createRecipe: Invalid prepTime, servings, or difficultyLevel provided");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // ולידציה של הוראות הכנה
    for (let i = 0; i < instructions.length; i++) {
        const instruction = instructions[i];
        if (!instruction.stepNumber || !instruction.text || !instruction.text.trim()) {
            console.log(`createRecipe: Invalid instruction at index ${i}`);
            throw new Error(ApiMessages.errorMessages.invalidData);
        }
    }

    // ולידציה של רכיבים
    const validUnits = ['gram', 'kilogram', 'ml', 'liter', 'tablespoon', 'teaspoon', 'cup', 'unit', 'quart'];

    for (let i = 0; i < ingredients.length; i++) {
        const ingredient = ingredients[i];
        if (!ingredient.name || !ingredient.name.trim() ||
            ingredient.quantity === undefined || ingredient.quantity <= 0 ||
            !ingredient.unit || !validUnits.includes(ingredient.unit)) {
            console.log('---', !ingredient.name, !ingredient.name.trim(), ingredient.quantity === undefined, ingredient.quantity <= 0, !ingredient.unit, !validUnits.includes(ingredient.unit));
            throw new Error(ApiMessages.errorMessages.invalidData);
        }
    }

    if (title.trim().length < 3 || title.trim().length > 100 ||
        description.trim().length < 5 || description.trim().length > 500) {
        console.log("createRecipe: Invalid title or description length");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }



    // הכנת נתוני המתכון
    const recipeData = {
        userId,
        category,
        title: title.trim(),
        description: description.trim(),
        instructions: instructions.map((inst, index) => ({
            stepNumber: inst.stepNumber || index + 1,
            text: inst.text.trim()
        })),
        ingredients: ingredients.map(ing => ({
            name: ing.name.trim(),
            quantity: Number(ing.quantity),
            unit: ing.unit,
            notes: ing.notes ? ing.notes.trim() : ""
        })),
        prepTime: Number(prepTime),
        servings: Number(servings),
        difficultyLevel: Number(difficultyLevel),
        imageUrl: imageResult.url || null,
        status: 'pending'
    };

    // יצירת המתכון
    const newRecipe = await recipeController.create(recipeData);
    if (!newRecipe) {
        console.log("createRecipe: Recipe creation failed");
        throw new Error(ApiMessages.errorMessages.creationFailed);
    }

    return {
        id: newRecipe._id
    };
};

// not in use - didn't debug
const updateRecipe = async (recipeId, updateData, currentUserId) => {
    // ולידציות בסיסיות במשולב
    if (!recipeId || !currentUserId || !updateData) {
        console.log("updateRecipe: Missing required fields: recipeId, currentUserId, or updateData");
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }


    // ולידציות פורמט ObjectId במשולב
    if (!recipeId.match(/^[0-9a-fA-F]{24}$/) || !currentUserId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("updateRecipe: Invalid recipeId or currentUserId format provided");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // בדיקה שיש לפחות שדה אחד לעדכון
    if (Object.keys(updateData).length === 0) {
        console.log("updateRecipe: No fields to update provided");
        throw new Error(ApiMessages.errorMessages.badRequest);
    }


    // בדיקה שהמתכון קיים ושייך למשתמש
    const existingRecipe = await recipeController.readOne({ _id: recipeId });
    if (!existingRecipe) {
        console.log("updateRecipe: Recipe not found");
        throw new Error(ApiMessages.errorMessages.notFound);
    }

    if (existingRecipe.userId.toString() !== currentUserId.toString()) {
        console.log("updateRecipe: Unauthorized action - user does not own the recipe");
        throw new Error(ApiMessages.errorMessages.unauthorized);
    }

    // ולידציות על נתוני העדכון
    const filteredUpdateData = {};

    Object.keys(updateData).forEach(key => {
        const value = updateData[key];

        // דילוג על ערכים null/undefined
        if (value === undefined || value === null) return;

        // ולידציות לפי סוג השדה
        switch (key) {
            case 'title':
                if (typeof value !== 'string' || value.trim().length < 3 || value.trim().length > 100) {
                    console.log("updateRecipe: Title must be a string between 3 and 100 characters");
                    throw new Error(ApiMessages.errorMessages.invalidData);
                }
                filteredUpdateData[key] = value.trim();
                break;

            case 'description':
                if (typeof value !== 'string' || value.trim().length < 10 || value.trim().length > 500) {
                    console.log("updateRecipe: Description must be a string between 10 and 500 characters");
                    throw new Error(ApiMessages.errorMessages.invalidData);
                }
                filteredUpdateData[key] = value.trim();
                break;

            case 'category':
                if (value !== undefined) {
                    const validCategories = ['main', 'appetizer', 'soup', 'salad', 'dessert', 'drink'];
                    if (!validCategories.includes(value)) {
                        console.log("updateRecipe: Invalid category provided");
                        throw new Error(ApiMessages.errorMessages.invalidData);
                    }
                }
                filteredUpdateData[key] = value;
                break;

            case 'prepTime':
            case 'servings':
                const numValue = Number(value);
                if (isNaN(numValue) || numValue < 1) {
                    console.log(`updateRecipe: ${key} must be a positive number`);
                    throw new Error(ApiMessages.errorMessages.invalidData);
                }
                filteredUpdateData[key] = numValue;
                break;

            case 'difficultyLevel':
                const difficultyNum = Number(value);
                if (isNaN(difficultyNum) || difficultyNum < 1 || difficultyNum > 5) {
                    console.log("updateRecipe: Difficulty level must be an integer between 1 and 5");
                    throw new Error(ApiMessages.errorMessages.invalidData);
                }
                filteredUpdateData[key] = difficultyNum;
                break;

            case 'instructions':
                if (!Array.isArray(value) || value.length === 0) {
                    console.log("updateRecipe: Instructions must be a non-empty array");
                    throw new Error(ApiMessages.errorMessages.invalidData);
                }
                // ولידציה של כל הוראה
                value.forEach((instruction, index) => {
                    if (!instruction.stepNumber || !instruction.text || !instruction.text.trim()) {
                        console.log(`updateRecipe: Invalid instruction at index ${index}`);
                        throw new Error(ApiMessages.errorMessages.invalidData);
                    }
                });
                filteredUpdateData[key] = value.map((inst, index) => ({
                    stepNumber: inst.stepNumber || index + 1,
                    text: inst.text.trim()
                }));
                break;

            case 'ingredients':
                if (!Array.isArray(value) || value.length === 0) {
                    console.log("updateRecipe: Ingredients must be a non-empty array");
                    throw new Error(ApiMessages.errorMessages.invalidData);
                }
                const validUnits = ['גרם', 'קילוגרם', 'מ"ל', 'ליטר', 'כף', 'כפית', 'כוס', 'יחידה', 'קורט'];

                // ولידציה של כל רכיב
                value.forEach(ingredient => {
                    if (!ingredient.name || !ingredient.name.trim() ||
                        ingredient.quantity === undefined || ingredient.quantity <= 0 ||
                        !ingredient.unit || !validUnits.includes(ingredient.unit)) {
                        console.log("updateRecipe: Invalid ingredient format provided");
                        throw new Error(ApiMessages.errorMessages.invalidData);
                    }
                });
                filteredUpdateData[key] = value.map(ing => ({
                    name: ing.name.trim(),
                    quantity: Number(ing.quantity),
                    unit: ing.unit,
                    notes: ing.notes ? ing.notes.trim() : ""
                }));
                break;

            default:
                // שדות אחרים מעובדים כפי שהם (אם תקינים)
                filteredUpdateData[key] = value;
        }
    });

    // בדיקה שנשאר משהו לעדכון אחרי הפילטור
    if (Object.keys(filteredUpdateData).length === 0) {
        console.log("updateRecipe: No valid fields to update provided");
        throw new Error(ApiMessages.errorMessages.badRequest);
    }

    // עדכון הסטטוס ל-pending אם יש שינויים תוכן
    filteredUpdateData.status = 'pending';

    // עדכון המתכון
    const updatedRecipe = await recipeController.update({ _id: recipeId }, filteredUpdateData);

    if (!updatedRecipe) {
        console.log("updateRecipe: Recipe update failed");
        throw new Error(ApiMessages.errorMessages.updateFailed);
    }

    return updatedRecipe;
};

// not in use - didn't debug
const deleteRecipe = async (recipeId, currentUserId) => {
    // ולידציות בסיסיות במשולב
    if (!recipeId || !currentUserId) {
        console.log("deleteRecipe: Missing required fields: recipeId or currentUserId");
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    // ולידציות פורמט ObjectId במשולב
    if (!recipeId.match(/^[0-9a-fA-F]{24}$/) || !currentUserId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("deleteRecipe: Invalid recipeId or currentUserId format provided");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // בדיקה שהמתכון קיים
    const existingRecipe = await recipeController.readOne({ _id: recipeId });
    if (!existingRecipe) {
        console.log("deleteRecipe: Recipe not found");
        throw new Error(ApiMessages.errorMessages.notFound);
    }

    // בדיקה שהמשתמש הוא הבעלים של המתכון
    if (existingRecipe.userId.toString() !== currentUserId.toString()) {
        console.log("deleteRecipe: Unauthorized action - user does not own the recipe");
        throw new Error(ApiMessages.errorMessages.unauthorized);
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
                        const result = await savedRecipeController.del(user._id.toString(), recipeId);
                    } catch (error) {

                        // לוג השגיאה אבל לא עוצר את התהליך
                        console.error(`Error removing saved recipe ${recipeId} from user ${user._id}:`, error);
                    }
                })
            );
        }
    } catch (error) {
        // לוג השגיאה אבל לא עוצר את מחיקת המתכון
        console.log(`Error removing recipe ${recipeId} from saved lists:`, error);
        throw new Error(`Error removing recipe ${recipeId} from saved lists:`, error.message);
    }

    // מחיקת כל התגובות של המתכון
    try {
        await commentService.deleteCommentsByRecipeId(recipeId);
    } catch (error) {
        console.log(`Error deleting comments for recipe ${recipeId}:`, error);
    }

    // מחיקת כל הדירוגים של המתכון
    try {
        await ratingService.deleteRatingsByRecipeId(recipeId);
    } catch (error) {
        console.log(`Error deleting ratings for recipe ${recipeId}:`, error);
    }

    // מחיקת המתכון עצמו
    const deletedRecipe = await recipeController.del({ _id: recipeId });

    if (!deletedRecipe) {
        console.log("deleteRecipe: Recipe deletion failed");
        throw new Error(ApiMessages.errorMessages.deletionFailed);
    }

    // await adminLogService.createLog({
    //     action: 'recipe_deleted',
    //     targetType: 'recipe',
    //     targetId: recipeId
    // });

    return {
        data: { id: recipeId },
        message: ApiMessages.successMessages.dataDeleted
    };
};

const getRecipesByUser = async (userId, requestType) => {
    // ולידציות בסיסיות במשולב
    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("getRecipesByUser: Invalid or missing userId");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // ולידציה של requestType
    if (requestType && !['currentUser', 'otherUser'].includes(requestType)) {
        console.log("getRecipesByUser: Invalid requestType provided");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // קביעת פילטר על בסיס סוג הבקשה
    let filter = { userId: userId };

    if (requestType === 'otherUser') {
        filter.status = 'active';
    }

    // שליפת המתכונים
    const recipes = await recipeController.read(filter);

    // אם אין מתכונים - זה לא שגיאה, רק מערך ריק
    if (!recipes || recipes.length === 0) {
        return [];
    }

    // שליפת דירוגים לכל מתכון במקביל
    const recipesWithRatings = await Promise.all(
        recipes.map(async (recipe) => {
            try {
                // שליפת הדירוגים למתכון
                const ratingResult = await ratingService.getAllRatings(recipe._id.toString());

                // עיבוד התוצאות
                const averageRating = ratingResult.data.averageRating;
                const totalRatings = ratingResult.data.totalCount;
                console.log(`Recipe ID: ${recipe._id}, Average Rating: ${averageRating}, Total Ratings: ${totalRatings}`);

                // המרה לאובייקט רגיל ומחיקת userId
                const recipeObj = recipe.toObject ? recipe.toObject() : { ...recipe };
                const { userId: recipeUserId, ...recipeWithoutUserId } = recipeObj;

                return {
                    ...recipeWithoutUserId,
                    averageRating: averageRating,
                    ratingsCount: totalRatings
                };
            } catch (error) {
                console.error(`Error processing recipe ${recipe._id}:`, error);
                // במקרה של שגיאה, החזר את המתכון בלי הדירוגים
                const recipeObj = recipe.toObject ? recipe.toObject() : { ...recipe };
                const { userId: recipeUserId, ...recipeWithoutUserId } = recipeObj;

                return {
                    ...recipeWithoutUserId,
                    averageRating: 0,
                    ratingsCount: 0
                };
            }
        })
    );

    return recipesWithRatings;
};


module.exports = { getRecipeById, getAllRecipes, createRecipe, updateRecipe, deleteRecipe, getRecipesByUser };