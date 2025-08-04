
require("dotenv").config();
require("./db.js").connect();
const controller = require("./controllers/savedRecipe.controller.js");
const runTest = async ()=>{

const userId = "6890db174c823e9bb5c2d228"; // Replace with a valid user ID
const res = await controller.read(userId);
console.log("Saved Recipes:", res);

}

runTest()