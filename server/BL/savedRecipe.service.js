const bcrypt = require('bcrypt');
const savedRecipeController = require("../DL/controllers/savedRecipe.controller.js");
const { loginAuth } = require("../middleware/auth.js");
const ApiMessages = require("../common/apiMessages.js");
const { getRecipeById } = require('./recipe.service.js');
const { getRecipesWithDetails } = require('./reciepDetails.service.js')
const recipeController = require("../DL/controllers/recipe.controller.js");
// Add recipe to saved list
async function addSavedRecipe(userId, recipeId) {
    if (!userId || !recipeId) {
        console.log("addSavedRecipe: Missing required fields: userId or recipeId");
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }
    if (!userId.match(/^[0-9a-fA-F]{24}$/) || !recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("addSavedRecipe: Invalid userId or recipeId format provided");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // Check if recipe already exists in saved list
    const user = await savedRecipeController.readWithUser(userId);
    if (!user) {
        console.log("addSavedRecipe: User not found");
        throw new Error(ApiMessages.errorMessages.notFound);
    }
    const alreadySaved = user.savedRecipes.some(recipe => recipe._id.toString() === recipeId.toString());
    if (alreadySaved) {
        console.log("addSavedRecipe: Recipe already exists in saved list");
        throw new Error(ApiMessages.errorMessages.conflict);
    }

    const result = await savedRecipeController.create(userId, recipeId);

    if (!result || result._id?.toString() !== userId.toString()) {
        console.log("addSavedRecipe: Failed to add recipe to saved list or returned unexpected result");
        throw new Error(ApiMessages.errorMessages.updateFailed);
    }
    return true;
}

// Get all saved recipes for user
async function getSavedRecipes(userId) {
    if (!userId) {
        console.log("getSavedRecipes: Missing required field: userId");
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("getSavedRecipes: Invalid userId format provided");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    const user = await savedRecipeController.read(userId);
    if (!user) {
        console.log("getSavedRecipes: User not found");
        throw new Error(ApiMessages.errorMessages.notFound);
    }
    // savedRecipes = ["dsadjsa;"]
    const savedRecipesWithDetails =user.savedRecipes?.map(async (e)=> {return await recipeController.readWithUserAndRatings({ _id: e._id })}); 
     
    // const savedRecipes = await Promise.all(
    //     user.savedRecipes.map(async (savedRecipe) => {
    //         const recipeDetails = await getRecipeById(savedRecipe._id.toString());
    //     })
    // );
    // if (!savedRecipes || savedRecipes.length === 0) {
    //     console.log("getSavedRecipes: No saved recipes found for user");
    //     throw new Error(ApiMessages.errorMessages.notFound);
    // }

  

    return savedRecipesWithDetails;
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
        console.log("removeSavedRecipe: Missing required fields: userId or recipeId");
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }
    if (!userId.match(/^[0-9a-fA-F]{24}$/) || !recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("removeSavedRecipe: Invalid userId or recipeId format provided");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // Check if recipe even exists in saved list
    const user = await savedRecipeController.readWithUser(userId);
    if (!user) {
        console.log("removeSavedRecipe: User not found");
        throw new Error(ApiMessages.errorMessages.notFound);
    }
    const wasSaved = user.savedRecipes.some(recipe => recipe._id.toString() === recipeId.toString());
    if (!wasSaved) {
        console.log("removeSavedRecipe: Recipe not found in saved list");
        throw new Error(ApiMessages.errorMessages.conflict);
    }

    const result = await savedRecipeController.del(userId, recipeId);

    if (!result || result._id?.toString() !== userId.toString()) {
        console.log("removeSavedRecipe: Failed to remove recipe from saved list or returned unexpected result");
        throw new Error(ApiMessages.errorMessages.updateFailed);
    }
    return true;
}

// Count saved recipes
async function countSavedRecipes(userId) {
    if (!userId) {
        console.log("countSavedRecipes: Missing required field: userId");
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("countSavedRecipes: Invalid userId format provided");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    const count = await savedRecipeController.count(userId);

    return count;
}
// const savedRecipesWithDetails = await Promise.all(
//     user.savedRecipes.map(async (savedRecipe) => {
//         const recipeDetails = await getRecipeById(savedRecipe._id.toString());

//         return {
//             ...savedRecipe,
//             creatorFullName: recipeDetails.fullName || 'Unknown User',
//             creatorUserName: recipeDetails.userName || 'Unknown User',
//             averageRating: recipeDetails.averageRating || 0,
//             ratingsCount: recipeDetails.ratingsCount || 0
//         };
//     })
// );
module.exports = {
    addSavedRecipe,
    getSavedRecipes,
    removeSavedRecipe,
    countSavedRecipes
};

