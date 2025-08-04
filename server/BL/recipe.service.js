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


module.exports = { getRecipes, getRecipeById, getAllRecipes };