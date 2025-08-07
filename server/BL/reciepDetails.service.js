const { readOne } = require("../DL/controllers/user.controller.js");
const ratingService = require("./rating.service.js");
const bcrypt = require('bcrypt');
const { loginAuth } = require("../middleware/auth.js");
const ApiMessages = require("../common/apiMessages.js");

async function getFullNameByUserId(userId) {
    if (!userId) {
        console.log("getUser: userId is required");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    if (typeof userId !== 'string' || !userId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("getUser: userId not a valid ObjectId");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    const user = await readOne(userId);

    if (!user) {
        console.log("getUser: user not found");
        throw new Error(ApiMessages.errorMessages.notFound);
    }

    return `${user.firstName} ${user.lastName}`;
}

async function getAverageRatingByRecipeId(recipeId) {}

async function getRecipesWithDetails(recipes) {
    if (!Array.isArray(recipes) || recipes.length === 0) {
        console.log("getRecipesWithDetails: No recipes provided");
        return [];
    }

    const detailedRecipes = await Promise.all(recipes.map(async (recipe) => {
        try {
            const [fullname, averageRating, totalRating] = await Promise.all([
                getFullNameByUserId(recipe.userId),
                getAverageRatingByRecipeId(recipe._id),
                getRatingCountByRecipeId(recipe._id)
            ]);

            return {
                ...recipe,
                fullname,
                averageRating,
                totalRating
            };
        } catch (error) {
            console.error(`getRecipesWithDetails: Failed to enrich recipe ${recipe._id}`, error);
            return recipe; // optionally skip or return partial
        }
    }));

    return detailedRecipes;
}

module.exports = { getRecipesWithDetails };