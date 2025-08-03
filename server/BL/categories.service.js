const categoriesController = require("../DL/controllers/category.controller");

async function getAllCategories() {
    const recipe = await categoriesController.read();
    console.log(recipe)
    return {success: true, data: recipe};
}
module.exports = {getAllCategories}