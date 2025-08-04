const recipeController = require("../DL/controllers/recipe.controller.js");
const userController = require("../DL/controllers/user.controller.js");
const ratingController = require("../BL/rating.service.js");
const ApiMessages = require("../common/apiMessages.js");


async function getRecipes(request) {
    if (!request) return { success: false, message: ApiMessages.errorMessages.forbidden };
    const { title, ingredients, instructions, freeSearch, userId } = request;
    const query = {};
    if (title) query.title = { $regex: title, $options: 'i' };
    if (ingredients) query.ingredients = { $regex: ingredients, $options: 'i' };
    if (instructions) query.instructions = { $regex: instructions, $options: 'i' };
    if (freeSearch) query.freeSearch = { $regex: freeSearch, $options: 'i' };
    if (userId) query.userId = userId;
    const recipes = await recipeController.read(query);
    return { success: true, data: recipe };
}


// async function getRecipeById(id) {
//     if (!id) return { success: false, message: ApiMessages.errorMessages.forbidden };
//     if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//         return { success: false, message: ApiMessages.errorMessages.invalidId };
//     }
//     const recipe = await recipeController.readOne({ _id: id });
//     return {success: true, data: recipe};
// }



async function getRecipeById(id) {
    if (!id) return { success: false, message: ApiMessages.errorMessages.forbidden };
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return { success: false, message: ApiMessages.errorMessages.invalidId };
    }

    try {
        // שליפת המתכון
        const recipe = await recipeController.readOne({ _id: id });

        if (!recipe) {
            return { success: false, message: ApiMessages.errorMessages.notFound };
        }

        // ביצוע שליפת המשתמש והדירוגים במקביל
        const [userResult, ratingResult] = await Promise.all([
            recipe.userId ? userController.readOne({ _id: recipe.userId }) : Promise.resolve(null),
            ratingController.getAllRatings(id)
        ]);

        // עיבוד התוצאות
        const userName = userResult?.name || userResult?.username || 'Unknown User';
        const averageRating = ratingResult.success ? ratingResult.data.averageRating : 0;
        const totalRatings = ratingResult.success ? ratingResult.data.totalCount : 0;

        // המרה לאובייקט רגיל ומחיקת userId
        const recipeObj = recipe.toObject();
        const { userId, ...recipeWithoutUserId } = recipeObj;
        // החזרת המתכון עם הנתונים הנוספים
        return {
            success: true,
            data: {
                ...recipeWithoutUserId,
                userName: userName,
                averageRating: averageRating,
                ratingsCount: totalRatings
            }
        };
    } catch (error) {
        console.error("Error in getRecipeById:", error);
        return {
            success: false,
            message: ApiMessages.errorMessages.serverError || "Failed to retrieve recipe"
        };
    }
}


async function getAllRecipes(filterByActive = true) {
    try {
        const recipes = await recipeController.readWithUserAndRatings();
        if(recipes.length == 0) {
            return { success: false, message: ApiMessages.errorMessages.notFound };
        }
        if(filterByActive) {
            return { success: true, data: recipes.filter(recipe => recipe.status === 'active')};
        }

        return { success: true, data: recipes };
    } catch (error) {
        console.error("Error in getAllRecipes:", error);
        return { 
            success: false, 
            message: "Failed to retrieve recipes",
            error: error.message 
        };
    }
}




const createRecipe = async (recipeInput) => {
    try {
        const {
            userId,
            categoryId,
            title,
            description,
            instructions,
            ingredients,
            prepTime,
            servings,
            difficultyLevel,
            imageUrl
        } = recipeInput;

        // ולידציה בסיסית
        if (!userId || !categoryId || !title || !description || !instructions || !ingredients || !prepTime || !servings || !difficultyLevel) {
            return {
                success: false,
                message: ApiMessages.MISSING_REQUIRED_FIELDS || "Missing required fields"
            };
        }

        // ולידציה של מערכים
        if (!Array.isArray(instructions) || instructions.length === 0) {
            return {
                success: false,
                message: "Instructions must be a non-empty array"
            };
        }

        if (!Array.isArray(ingredients) || ingredients.length === 0) {
            return {
                success: false,
                message: "Ingredients must be a non-empty array"
            };
        }

        // ולידציה של הוראות הכנה
        for (let i = 0; i < instructions.length; i++) {
            const instruction = instructions[i];
            if (!instruction.stepNumber || !instruction.text) {
                return {
                    success: false,
                    message: `Instruction ${i + 1} is missing stepNumber or text`
                };
            }
        }

        // ולידציה של רכיבים
        for (let i = 0; i < ingredients.length; i++) {
            const ingredient = ingredients[i];
            if (!ingredient.name || !ingredient.quantity || !ingredient.unit) {
                return {
                    success: false,
                    message: `Ingredient ${i + 1} is missing required fields (name, quantity, unit)`
                };
            }

            // בדיקת יחידות מדידה תקינות
            const validUnits = ['גרם', 'קילוגרם', 'מ"ל', 'ליטר', 'כף', 'כפית', 'כוס', 'יחידה', 'קורט'];
            if (!validUnits.includes(ingredient.unit)) {
                return {
                    success: false,
                    message: `Invalid unit "${ingredient.unit}" for ingredient ${ingredient.name}`
                };
            }
        }

        // ולידציה של ערכים מספריים
        if (prepTime < 0) {
            return {
                success: false,
                message: "Prep time must be a positive number"
            };
        }

        if (servings < 1) {
            return {
                success: false,
                message: "Servings must be at least 1"
            };
        }

        if (difficultyLevel < 1 || difficultyLevel > 5) {
            return {
                success: false,
                message: "Difficulty level must be between 1 and 5"
            };
        }

        // הכנת נתוני המתכון
        const recipeData = {
            userId,
            categoryId,
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
            status: 'pending' // הסטטוס נקבע בשרת כמו שביקשת
        };

        // יצירת המתכון
        const newRecipe = await recipeController.create(recipeData);

        return {
            success: true,
            data: newRecipe,
            message: ApiMessages.CREATED || "Recipe created successfully and pending approval"
        };

    } catch (error) {
        console.error("Error in createRecipe service:", error);
        return {
            success: false,
            message: ApiMessages.SERVER_ERROR || "Failed to create recipe",
            error: error.message
        };
    }
};







module.exports = { getRecipes, getRecipeById, getAllRecipes, createRecipe };