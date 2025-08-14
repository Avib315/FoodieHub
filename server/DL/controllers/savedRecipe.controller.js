// savedRecipes.controller.js

const userModel = require('../models/user.model.js');

// הוספת מתכון למתכונים השמורים
const create = async (userId, recipeId) => {
    return await userModel.findByIdAndUpdate(
        userId,
        { $addToSet: { savedRecipes: recipeId } }, // $addToSet מונע כפילויות
        { new: true }
    );
};

// קבלת כל המתכונים השמורים של משתמש
const read = async (userId) => {
    return await userModel.findById(userId)
        .populate({
            path: 'savedRecipes',
            select: 'title description imageUrl averageRating ratingsCount status prepTime servings difficultyLevel',
            match: { status: 'active' } // רק מתכונים פעילים
        });
};

// קבלת משתמש אחד עם המתכונים השמורים שלו
const readWithUser = async (userId) => {
    return await userModel.findById(userId).populate('savedRecipes');
};

// הסרת מתכון מהמתכונים השמורים
const del = async (userId, recipeId) => {
    return await userModel.findByIdAndUpdate(
        userId,
        { $pull: { savedRecipes: recipeId } },
        { new: true }
    );
};


// קבלת מספר המתכונים השמורים
const count = async (userId) => {
    const user = await userModel.findById(userId, { savedRecipes: 1 }).populate('savedRecipes');
    return user ? user.savedRecipes.filter(res => res.status === 'active').length : 0;
};

module.exports = {
    create,
    read,
    readWithUser,
    del,
    count
};