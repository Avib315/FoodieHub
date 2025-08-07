const savedRecipeController = require("../DL/controllers/savedRecipe.controller.js");
const bcrypt = require('bcrypt');
const { loginAuth } = require("../middleware/auth.js");
const ApiMessages = require("../common/apiMessages.js");
const { getRecipeById } = require('./recipe.service.js');

// Add recipe to saved list
async function addSavedRecipe(userId, recipeId) {
    if (!userId || !recipeId) {
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }
    if (!userId.match(/^[0-9a-fA-F]{24}$/) || !recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // Check if recipe already exists in saved list
    const user = await savedRecipeController.readWithUser(userId);
    if (!user) {
        throw new Error(ApiMessages.errorMessages.notFound);
    }
    const alreadySaved = user.savedRecipes.some(recipe => recipe._id.toString() === recipeId.toString());
    if (alreadySaved) {
        throw new Error(ApiMessages.errorMessages.conflict);
    }

    const result = await savedRecipeController.create(userId, recipeId);

    if (!result || result._id?.toString() !== userId.toString()) {
        throw new Error(ApiMessages.errorMessages.updateFailed);
    }
    return true;
}

// Get all saved recipes for user
async function getSavedRecipes(userId) {
    if (!userId) {
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    const user = await savedRecipeController.read(userId);

    if (!user || !user.savedRecipes) {
        throw new Error(ApiMessages.errorMessages.notFound);
    }

    // שלוף פרטים מלאים לכל מתכון שמור
    const savedRecipesWithDetails = await Promise.all(
        user.savedRecipes.map(async (savedRecipe) => {
            const recipeDetails = await getRecipeById(savedRecipe._id.toString());

            return {
                ...savedRecipe,
                creatorFullName: recipeDetails.fullName || 'Unknown User',
                creatorUserName: recipeDetails.userName || 'Unknown User',
                averageRating: recipeDetails.averageRating || 0,
                ratingsCount: recipeDetails.ratingsCount || 0
            };
        })
    );

    return savedRecipesWithDetails;

    return user.savedRecipes;
}


// async function getSavedRecipes(userId) {
//     if (!userId) {
//         throw new Error(ApiMessages.errorMessages.missingRequiredFields);
//     }
//     if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
//         throw new Error(ApiMessages.errorMessages.invalidData);
//     }

//     const user = await savedRecipeController.read(userId);

//     if (!user || !user.savedRecipes) {
//         throw new Error(ApiMessages.errorMessages.notFound);
//     }
//     console.log(user.savedRecipe);

// שלוף פרטים מלאים לכל מתכון שמור
// const savedRecipesWithDetails = await Promise.all(
//     user.savedRecipes.map(async (savedRecipe) => {
//             const recipeDetails = await Rec  .getRecipeById(savedRecipe._id.toString());

//             return {
//                 ...savedRecipe,
//                 creatorFullName: recipeDetails.fullName || 'Unknown User',
//                 creatorUserName: recipeDetails.userName || 'Unknown User',
//                 averageRating: recipeDetails.averageRating || 0,
//                 ratingsCount: recipeDetails.ratingsCount || 0
//             };
//     })
// );

// return savedRecipesWithDetails;
// }



// Delete recipe from saved list
async function removeSavedRecipe(userId, recipeId) {
    if (!userId || !recipeId) {

        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }
    if (!userId.match(/^[0-9a-fA-F]{24}$/) || !recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // Check if recipe even exists in saved list
    const user = await savedRecipeController.readWithUser(userId);
    if (!user) {
        throw new Error(ApiMessages.errorMessages.notFound);
    }
    const wasSaved = user.savedRecipes.some(recipe => recipe._id.toString() === recipeId.toString());
    if (!wasSaved) {
        throw new Error(ApiMessages.errorMessages.conflict);
    }

    const result = await savedRecipeController.del(userId, recipeId);

    if (!result || result._id?.toString() !== userId.toString()) {
        throw new Error(ApiMessages.errorMessages.updateFailed);
    }
    return true;
}

// Count saved recipes
async function countSavedRecipes(userId) {
    if (!userId) {
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    const count = await savedRecipeController.count(userId);

    return count;
}

module.exports = {
    addSavedRecipe,
    getSavedRecipes,
    removeSavedRecipe,
    countSavedRecipes
};