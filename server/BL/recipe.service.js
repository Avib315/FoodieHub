const recipeController = require("../DL/controllers/recipe.controller.js");
const userController = require("../DL/controllers/user.controller.js");
const ratingController = require("../BL/rating.service.js");
const ApiMessages = require("../common/apiMessages.js");



async function getAllRecipes(filterByActive = true) {
    // ולידציה של הפרמטר
    if (typeof filterByActive !== 'boolean') {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // שליפת המתכונים
    const recipes = await recipeController.readWithUserAndRatings();

    // בדיקה אם יש מתכונים (אבל לא זורקים שגיאה, זה מצב תקין)
    if (!recipes || recipes.length === 0) {
        return {
            data: []
        };
    }
    // סינון המתכונים על פי הסטטוס אם נדרש
    const filteredRecipes = filterByActive
        ? recipes.filter(recipe => recipe.status === 'active')
        : recipes;

    return filteredRecipes;
}





async function getRecipeById(id) {
    // ולידציות בסיסיות במשולב
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // שליפת המתכון
    const recipe = await recipeController.readOne({ _id: id });
    if (!recipe) {
        throw new Error(ApiMessages.errorMessages.notFound);
    }

    // ביצוע שליפת המשתמש והדירוגים במקביל
    const [userResult, ratingResult] = await Promise.all([
        recipe.userId ? userController.readOne({ _id: recipe.userId }) : Promise.resolve(null),
        ratingController.getAllRatings(id)
    ]);

    // עיבוד התוצאות
    const userName = userResult?.username || 'Unknown User';
    const averageRating = ratingResult.data.averageRating;
    const totalRatings = ratingResult.data.totalCount;

    // המרה לאובייקט רגיל ומחיקת userId
    const recipeObj = recipe.toObject();
    const { userId, ...recipeWithoutUserId } = recipeObj;

    // החזרת המתכון עם הנתונים הנוספים
    return {
        ...recipeWithoutUserId,
        userName: userName,
        averageRating: averageRating,
        ratingsCount: totalRatings
    };
}




const createRecipe = async (recipeInput) => {
    // בדיקת קיום האובייקט
    if (!recipeInput) {
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
        imageUrl
    } = recipeInput;

    // ולידציות בסיסיות במשולב
    if (!userId || !category || !title || !description || !instructions ||
        !ingredients || prepTime === undefined || servings === undefined ||
        difficultyLevel === undefined) {
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    // ולידציות פורמט ObjectId במשולב
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    if (category !== undefined) {
        const validCategories = ['main', 'appetizer', 'soup', 'salad', 'dessert', 'drink'];
        if (!validCategories.includes(category)) {
            throw new Error(ApiMessages.errorMessages.invalidData);
        }
    }

    // ולידציות מערכים במשולב
    if (!Array.isArray(instructions) || instructions.length === 0 ||
        !Array.isArray(ingredients) || ingredients.length === 0) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // ולידציות ערכים מספריים במשולב
    if (prepTime < 0 || servings < 1 || difficultyLevel < 1 || difficultyLevel > 5) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // ולידציה של הוראות הכנה
    for (let i = 0; i < instructions.length; i++) {
        const instruction = instructions[i];
        if (!instruction.stepNumber || !instruction.text || !instruction.text.trim()) {
            throw new Error(ApiMessages.errorMessages.invalidData);
        }
    }

    // ולידציה של רכיבים
    const validUnits = ['גרם', 'קילוגרם', 'מ"ל', 'ליטר', 'כף', 'כפית', 'כוס', 'יחידה', 'קורט'];

    for (let i = 0; i < ingredients.length; i++) {
        const ingredient = ingredients[i];
        if (!ingredient.name || !ingredient.name.trim() ||
            ingredient.quantity === undefined || ingredient.quantity <= 0 ||
            !ingredient.unit || !validUnits.includes(ingredient.unit)) {
            throw new Error(ApiMessages.errorMessages.invalidData);
        }
    }

    if (title.trim().length < 3 || title.trim().length > 100 ||
        description.trim().length < 10 || description.trim().length > 500) {
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
        imageUrl: imageUrl || null,
        status: 'pending'
    };

    // יצירת המתכון
    const newRecipe = await recipeController.create(recipeData);
    if (!newRecipe) {
        throw new Error(ApiMessages.errorMessages.creationFailed);
    }

    return {
        id: newRecipe._id
    };
};



const updateRecipe = async (recipeId, updateData, currentUserId) => {
    // ولידציות בסיסיות במשולב
    if (!recipeId || !currentUserId || !updateData) {
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    // ولידציות פורמט ObjectId במשולב
    if (!recipeId.match(/^[0-9a-fA-F]{24}$/) || !currentUserId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // בדיקה שיש לפחות שדה אחד לעדכון
    if (Object.keys(updateData).length === 0) {
        throw new Error(ApiMessages.errorMessages.badRequest);
    }


    // בדיקה שהמתכון קיים ושייך למשתמש
    const existingRecipe = await recipeController.readOne({ _id: recipeId });
    if (!existingRecipe) {
        throw new Error(ApiMessages.errorMessages.notFound);
    }

    if (existingRecipe.userId.toString() !== currentUserId.toString()) {
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
                    throw new Error(ApiMessages.errorMessages.invalidData);
                }
                filteredUpdateData[key] = value.trim();
                break;

            case 'description':
                if (typeof value !== 'string' || value.trim().length < 10 || value.trim().length > 500) {
                    throw new Error(ApiMessages.errorMessages.invalidData);
                }
                filteredUpdateData[key] = value.trim();
                break;

            case 'category':
                if (value !== undefined) {
                    const validCategories = ['main', 'appetizer', 'soup', 'salad', 'dessert', 'drink'];
                    if (!validCategories.includes(value)) {
                        throw new Error(ApiMessages.errorMessages.invalidData);
                    }
                }
                filteredUpdateData[key] = value;
                break;

            case 'prepTime':
            case 'servings':
                const numValue = Number(value);
                if (isNaN(numValue) || numValue < 1) {
                    throw new Error(ApiMessages.errorMessages.invalidData);
                }
                filteredUpdateData[key] = numValue;
                break;

            case 'difficultyLevel':
                const difficultyNum = Number(value);
                if (isNaN(difficultyNum) || difficultyNum < 1 || difficultyNum > 5) {
                    throw new Error(ApiMessages.errorMessages.invalidData);
                }
                filteredUpdateData[key] = difficultyNum;
                break;

            case 'instructions':
                if (!Array.isArray(value) || value.length === 0) {
                    throw new Error(ApiMessages.errorMessages.invalidData);
                }
                // ولידציה של כל הוראה
                value.forEach((instruction, index) => {
                    if (!instruction.stepNumber || !instruction.text || !instruction.text.trim()) {
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
                    throw new Error(ApiMessages.errorMessages.invalidData);
                }
                const validUnits = ['גרם', 'קילוגרם', 'מ"ל', 'ליטר', 'כף', 'כפית', 'כוס', 'יחידה', 'קורט'];

                // ولידציה של כל רכיב
                value.forEach(ingredient => {
                    if (!ingredient.name || !ingredient.name.trim() ||
                        ingredient.quantity === undefined || ingredient.quantity <= 0 ||
                        !ingredient.unit || !validUnits.includes(ingredient.unit)) {
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
        throw new Error(ApiMessages.errorMessages.badRequest);
    }

    // עדכון הסטטוס ל-pending אם יש שינויים תוכן
    filteredUpdateData.status = 'pending';

    // עדכון המתכון
    const updatedRecipe = await recipeController.update({ _id: recipeId }, filteredUpdateData);

    if (!updatedRecipe) {
        throw new Error(ApiMessages.errorMessages.updateFailed);
    }

    return {
        data: updatedRecipe
    };
};



const deleteRecipe = async (recipeId, currentUserId) => {
    // ولידציות בסיסיות במשולב
    if (!recipeId || !currentUserId) {
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    // ولידציות פורמט ObjectId במשולב
    if (!recipeId.match(/^[0-9a-fA-F]{24}$/) || !currentUserId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // בדיקה שהמתכון קיים
    const existingRecipe = await recipeController.readOne({ _id: recipeId });
    if (!existingRecipe) {
        throw new Error(ApiMessages.errorMessages.notFound);
    }

    // בדיקה שהמשתמש הוא הבעלים של המתכון
    if (existingRecipe.userId.toString() !== currentUserId.toString()) {
        throw new Error(ApiMessages.errorMessages.unauthorized);
    }

    // מחיקת המתכון
    const deletedRecipe = await recipeController.del({ _id: recipeId });
    
    if (!deletedRecipe) {
        throw new Error(ApiMessages.errorMessages.deletionFailed);
    }

    return {
        data: { id: recipeId },
        message: ApiMessages.successMessages.dataDeleted
    };
};




const getRecipesByUser = async (userId, requestType) => {
    // ولידציות בסיסיות במשולב
    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // ולידציה של requestType
    if (requestType && !['currentUser', 'otherUser'].includes(requestType)) {
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
        return {
            data: []
        };
    }

    // שליפת דירוגים לכל מתכון במקביל
    const recipesWithRatings = await Promise.all(
        recipes.map(async (recipe) => {
            try {
                // שליפת הדירוגים למתכון
                const ratingResult = await ratingController.getAllRatings(recipe._id.toString());

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