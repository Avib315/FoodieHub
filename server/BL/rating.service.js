const ratingController = require("../DL/controllers/rating.controller");
const recipeController = require("../DL/controllers/recipe.controller");
const { addRecipeRatedNotification } = require("./notification.service.js");
const ApiMessages = require('../common/apiMessages.js');

// קבלת כל הדירוגים לפי מתכון
const getAllRatings = async (recipeId) => {
    // ולידציה של הפרמטרים
    if (!recipeId || !recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("getAllRatings: Invalid or missing recipeId");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    const ratings = await ratingController.read({ recipeId });
    if (!ratings) {
        console.log("getAllRatings: No ratings found for the given recipeId");
        throw new Error(ApiMessages.errorMessages.notFound);
    }

    let averageRating = 0;
    if (ratings && ratings.length > 0) {
        const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        averageRating = (totalRating / ratings.length).toFixed(1);
    }

    return {
        data: {
            ratings: ratings,
            totalCount: ratings ? ratings.length : 0,
            averageRating: parseFloat(averageRating)
        },
    };

};

const createRating = async (ratingInput) => {
    // בדיקת קיום האובייקט
    if (!ratingInput) {
        console.log("createRating: Missing required fields in ratingInput");
        throw new Error(ApiMessages.errorMessages.badRequest);
    }

    const { userId, recipeId, rating, review } = ratingInput;

    // ולידציה בסיסית - קיום שדות
    if (!userId || !recipeId || rating === undefined || rating === null) {
        console.log("createRating: Missing required fields: userId, recipeId, or rating");
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    // ולידציה של פורמט ObjectId
    if (!userId.match(/^[0-9a-fA-F]{24}$/) || !recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("createRating: Invalid userId or recipeId format provided");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // ולידציה של טיפוס הדירוג
    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || !Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        console.log("createRating: Rating must be an integer between 1 and 5");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // ולידציה של הביקורת (אם קיימת)
    if (review !== undefined && review !== null) {
        if (typeof review !== 'string') {
            console.log("createRating: Review must be a string");
            throw new Error(ApiMessages.errorMessages.invalidData);
        }
    }

    // בדיקה שהמתכון קיים ופעיל
    const recipe = await recipeController.readOne({ _id: recipeId });
    if (!recipe) {
        console.log("createRating: Recipe not found");
        throw new Error(ApiMessages.errorMessages.notFound);
    }
    if (recipe.status !== 'active') {
        console.log("createRating: Recipe is not active");
        throw new Error(ApiMessages.errorMessages.forbidden);
    }

    // בדיקה שהמשתמש לא מדרג את המתכון שלו
    if (recipe.userId.toString() === userId.toString()) {
        console.log("createRating: User cannot rate their own recipe");
        throw new Error(ApiMessages.errorMessages.forbidden);
    }

    // בדיקה אם המשתמש כבר דירג את המתכון
    const existingRating = await ratingController.readOne({ userId, recipeId });
    if (existingRating) {
        console.log("createRating: User has already rated this recipe");
        throw new Error(ApiMessages.errorMessages.conflict);
    }

    // יצירת אובייקט הדירוג
    const ratingData = {
        userId,
        recipeId,
        rating: ratingNum,
        review: review ? review.trim() : ""
    };

    // יצירת הדירוג בשכבת הנתונים
    const newRating = await ratingController.create(ratingData);

    if (!newRating) {
        console.log("createRating: Rating creation failed");
        throw new Error(ApiMessages.errorMessages.creationFailed);
    }

    await addRecipeRatedNotification(recipeId);
    return newRating._id;
};

// not in use - didn't debug
const deleteRating = async (ratingInput) => {
    // בדיקת קיום האובייקט וולידציות בסיסיות במשולב
    if (!ratingInput || !ratingInput.userId || !ratingInput.ratingId) {
        console.log("deleteRating: Missing required fields in ratingInput");
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    const { userId, ratingId } = ratingInput;

    // ולידציות פורמט ObjectId במשולב
    if (!userId.match(/^[0-9a-fA-F]{24}$/) || !ratingId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("deleteRating: Invalid userId or ratingId format provided");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    const filterObject = { _id: ratingId, userId: userId };

    // בדיקה שהדירוג קיים ושייך למשתמש
    const existingRating = await ratingController.readOne(filterObject);
    if (!existingRating) {
        console.log("deleteRating: Rating not found or does not belong to the user");
        throw new Error(ApiMessages.errorMessages.notFound);
    }

    // מחיקת הדירוג
    const deletedRating = await ratingController.del(filterObject);

    if (!deletedRating) {
        console.log("deleteRating: Rating deletion failed");
        throw new Error(ApiMessages.errorMessages.deletionFailed);
    }

    return {
        data: deletedRating
    };
};

// // עדכון דירוג
// const updateRating = async (ratingInput) => {
//     try {
//         const { userId, recipeId, rating, review } = ratingInput;
//         console.log(userId,recipeId );

//         // ולידציה
//         if (!userId || !recipeId) {
//             return {
//                 success: false,
//                 message: ApiMessages.MISSING_REQUIRED_FIELDS || "User ID and Recipe ID are required"
//             };
//         }

//         // בדיקה שהדירוג קיים
//         const existingRating = await ratingController.readOne({userId, recipeId});
//         if (!existingRating) {
//             return {
//                 success: false,
//                 message: ApiMessages.NOT_FOUND || "Rating not found. Create a new rating instead."
//             };
//         }

//         // בדיקה שהדירוג שייך למשתמש הנוכחי (בדיקה כפולה לביטחון)
//         if (existingRating.userId.toString() !== userId.toString()) {
//             return {
//                 success: false,
//                 message: "Unauthorized: This rating doesn't belong to you"
//             };
//         }

//         // ולידציה של הדירוג החדש
//         if (rating && (rating < 1 || rating > 5)) {
//             return {
//                 success: false,
//                 message: "Rating must be between 1 and 5"
//             };
//         }

//         // הכנת נתוני העדכון
//         const updateData = { };

//         if (rating) updateData.rating = parseInt(rating);
//         if (review !== undefined) updateData.review = review;

//         // עדכון הדירוג
//         const updatedRating = await ratingController.update({_id:existingRating._id}, updateData);

//         return {
//             success: true,
//             data: updatedRating,
//             message: ApiMessages.UPDATED || "Rating updated successfully"
//         };
//     } catch (error) {
//         console.error("Error in updateRating service:", error);
//         return {
//             success: false,
//             message: ApiMessages.SERVER_ERROR || "Failed to update rating",
//         };
//     }
// };

// not in use - didn't debug
const updateRating = async (ratingInput) => {
    // בדיקת קיום האובייקט וולידציות בסיסיות במשולב
    if (!ratingInput || !ratingInput.userId || !ratingInput.recipeId) {
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    const { userId, recipeId, rating, review } = ratingInput;

    // ולידציות פורמט ObjectId במשולב
    if (!userId.match(/^[0-9a-fA-F]{24}$/) || !recipeId.match(/^[0-9a-fA-F]{24}$/)) {

        console.log("updateRating: Invalid userId or recipeId format provided");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // בדיקה שהדירוג קיים ושייך למשתמש
    const existingRating = await ratingController.readOne({ userId, recipeId });
    if (!existingRating) {
        console.log("updateRating: Rating not found or does not belong to the user");
        throw new Error(ApiMessages.errorMessages.notFound);
    }

    // ולידציות נתוני העדכון במשולב
    if (rating !== undefined && rating !== null) {
        const ratingNum = Number(rating);
        if (isNaN(ratingNum) || !Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            console.log("updateRating: Rating must be an integer between 1 and 5");
            throw new Error(ApiMessages.errorMessages.invalidData);
        }
    }

    // ולידציה של הביקורת (אם קיימת)
    if (review !== undefined && review !== null &&
        (typeof review !== 'string' || review.length > 1000)) {
        console.log("updateRating: Review must be a string and less than 1000 characters");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // בדיקה שיש לפחות שדה אחד לעדכון
    if (rating === undefined && review === undefined) {
        console.log("updateRating: No fields to update provided");
        throw new Error(ApiMessages.errorMessages.badRequest);
    }

    // הכנת נתוני העדכון
    const updateData = {};

    if (rating !== undefined && rating !== null) {
        updateData.rating = parseInt(rating);
    }
    if (review !== undefined) {
        updateData.review = review ? review.trim() : "";
    }

    // עדכון הדירוג
    const updatedRating = await ratingController.update({ _id: existingRating._id }, updateData);

    if (!updatedRating) {
        console.log("updateRating: Rating update failed");
        throw new Error(ApiMessages.errorMessages.updateFailed);
    }

    return {
        data: updatedRating
    };
};

// Delete all ratings for a specific recipe
async function deleteRatingsByRecipeId(recipeId) {
    if (!recipeId) {
        console.log("deleteRatingsByRecipeId: Missing required fields: recipeId");
        return false;
    }
    if (!recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("deleteRatingsByRecipeId: Invalid recipeId format provided");
        return false
    }

    const result = await ratingController.deleteMany({ recipeId });

    if (!result || result.deletedCount === 0) {
        console.log("function deleteRatingsByRecipeId: No ratings found for the given recipeId or deletion failed");
        return false;
    }

    return true;
}



module.exports = {
    getAllRatings,
    createRating,
    deleteRating,
    updateRating,
    deleteRatingsByRecipeId
};