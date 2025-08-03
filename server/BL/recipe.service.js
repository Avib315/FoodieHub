const recipeController = require("../DL/controllers/recipe.controller.js");
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
    return recipes;
}
async function getRecipeById(id) {
    if (!id) return { success: false, message: ApiMessages.errorMessages.forbidden };
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return { success: false, message: ApiMessages.errorMessages.invalidId };
    }
    const recipe = await recipeController.readOne({ _id: id });
    return recipe;
}
async function getAllRecipes() {
    const recipe = await recipeController.read();
    console.log(recipe)
    return recipe;
}
module.exports = { getRecipes, getRecipeById, getAllRecipes };