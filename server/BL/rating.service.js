const ratingController = require("../DL/controllers/rating.controller");
const ApiMessages = require('../common/apiMessages.js');

// קבלת כל הדירוגים לפי מתכון
const getAllRatings = async (recipeId) => {
    try {
        // ולידציה של הפרמטרים
        if (!recipeId) {
            return {
                success: false,
                message: "Recipe ID is required"
            };
        }

        // קריאה לשכבת הנתונים
        const ratings = await ratingController.read({recipeId});
        
        // חישוב ממוצע דירוגים
        let averageRating = 0;
        if (ratings && ratings.length > 0) {
            const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
            averageRating = (totalRating / ratings.length).toFixed(1);
        }

        return {
            success: true,
            data: {
                ratings: ratings,
                totalCount: ratings ? ratings.length : 0,
                averageRating: parseFloat(averageRating)
            },
        };
    } catch (error) {
        console.error("Error in getAllRatings service:", error);
        return {
            success: false
        };
    }
};

// יצירת דירוג חדש
const createRating = async (ratingInput) => {
    try {
        const { userId, recipeId, rating, review } = ratingInput;

        // ולידציה בסיסית
        if (!userId || !recipeId || !rating) {
            return {
                success: false,
                message:  "User ID, Recipe ID and rating are required"
            };
        }

        // ולידציה של הדירוג
        if (rating < 1 || rating > 5) {
            return {
                success: false,
                message: "Rating must be between 1 and 5"
            };
        }

        // בדיקה אם המשתמש כבר דירג את המתכון
        const existingRating = await ratingController.readOne({userId, recipeId});
        if (existingRating) {
            return {
                success: false,
                message: "User has already rated this recipe. Use update instead."
            };
        }

        // יצירת אובייקט הדירוג
        const ratingData = {
            userId,
            recipeId,
            rating: parseInt(rating),
            review: review || ""
        };

        // יצירת הדירוג בשכבת הנתונים
        const newRating = await ratingController.create(ratingData);

        return {
            success: true,
            data: newRating,
            message: ApiMessages.CREATED || "Rating created successfully"
        };
    } catch (error) {
        console.error("Error in createRating service:", error);
        return {
            success: false,
            message: ApiMessages.SERVER_ERROR || "Failed to create rating",
            error: error.message
        };
    }
};

// מחיקת דירוג
const deleteRating = async (ratingInput) => {
    try {
        const { userId, ratingId } = ratingInput;

        // ולידציה
        if (!userId || !ratingId) {
            return {
                success: false,
                message: ApiMessages.MISSING_REQUIRED_FIELDS || "User ID and Rating ID are required"
            };
        }
        // ratingId = "fsfdsfsrewr32424"
        // filter = {_id: ratingId, userId: userId};
        const filterObject = { _id: ratingId, userId: userId };

        // בדיקה שהדירוג קיים
        const existingRating = await ratingController.readOne(filterObject);
        if (!existingRating) {
            return {
                success: false,
                message: ApiMessages.NOT_FOUND || "Rating not found"
            };
        }

        // בדיקה שהדירוג שייך למשתמש הנוכחי (בדיקה כפולה לביטחון)
        if (existingRating.userId.toString() !== userId.toString()) {
            return {
                success: false,
                message: "Unauthorized: This rating doesn't belong to you"
            };
        }

        // מחיקת הדירוג
        
        const deletedRating = await ratingController.del(filterObject);
        console.log(deletedRating);
        
        if (!deletedRating) {
            return {
                success: false,
                message: ApiMessages.NOT_FOUND || "Rating not found"
            };
        }

        return {
            success: true,
            message: ApiMessages.DELETED || "Rating deleted successfully"
        };
    } catch (error) {
        console.error("Error in deleteRating service:", error);
        return {
            success: false,
            message: ApiMessages.SERVER_ERROR || "Failed to delete rating",
            error: error.message
        };
    }
};

// עדכון דירוג
const updateRating = async (ratingInput) => {
    try {
        const { userId, recipeId, rating, review } = ratingInput;
        console.log(userId,recipeId );
        
        // ולידציה
        if (!userId || !recipeId) {
            return {
                success: false,
                message: ApiMessages.MISSING_REQUIRED_FIELDS || "User ID and Recipe ID are required"
            };
        }

        // בדיקה שהדירוג קיים
        const existingRating = await ratingController.readOne({userId, recipeId});
        if (!existingRating) {
            return {
                success: false,
                message: ApiMessages.NOT_FOUND || "Rating not found. Create a new rating instead."
            };
        }

        // בדיקה שהדירוג שייך למשתמש הנוכחי (בדיקה כפולה לביטחון)
        if (existingRating.userId.toString() !== userId.toString()) {
            return {
                success: false,
                message: "Unauthorized: This rating doesn't belong to you"
            };
        }

        // ולידציה של הדירוג החדש
        if (rating && (rating < 1 || rating > 5)) {
            return {
                success: false,
                message: "Rating must be between 1 and 5"
            };
        }

        // הכנת נתוני העדכון
        const updateData = { };
        
        if (rating) updateData.rating = parseInt(rating);
        if (review !== undefined) updateData.review = review;

        // עדכון הדירוג
        const updatedRating = await ratingController.update({_id:existingRating._id}, updateData);

        return {
            success: true,
            data: updatedRating,
            message: ApiMessages.UPDATED || "Rating updated successfully"
        };
    } catch (error) {
        console.error("Error in updateRating service:", error);
        return {
            success: false,
            message: ApiMessages.SERVER_ERROR || "Failed to update rating",
        };
    }
};


module.exports = {
    getAllRatings,
    createRating,
    deleteRating,
    updateRating
};