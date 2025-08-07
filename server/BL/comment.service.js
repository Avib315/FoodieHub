const commentController = require("../DL/controllers/comment.controller.js");
const recipeController = require("../DL/controllers/recipe.controller.js");
const userController = require("../DL/controllers/user.controller.js");
const { addRecipeCommentedNotification } = require("./notification.service.js");
const ApiMessages = require("../common/apiMessages.js");

// Get all comments for a given recipe
async function getRecipeComments(recipeId) {
    if (!recipeId) {
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }
    if (!recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    const comments = await commentController.read({ recipeId });

    if (!comments || comments.length === 0) {
        throw new Error(ApiMessages.errorMessages.notFound);
    }

    // הוסף את שם המשתמש לכל הערה ותסיר את userId
    const commentsWithUserName = await Promise.all(
        comments.map(async (comment) => {
            // אם זה Mongoose document, המר לאובייקט רגיל
            const commentObj = comment.toObject ? comment.toObject() : comment;
            
            // שלוף את שם המשתמש
            let userName = 'Unknown User';
            let fullName = 'Unknown User';
            
            if (commentObj.userId) {
                try {
                    const user = await userController.readOne({ _id: commentObj.userId });
                    if (user) {
                        userName = user.username || 'Unknown User';
                        fullName = user.firstName + " " + user.lastName;
                    }
                } catch (error) {
                    console.error('Error fetching user for comment:', error);
                }
            }
            
            // החזר הערה ללא userId אבל עם שם המשתמש
            const { userId, ...commentWithoutUserId } = commentObj;
            return {
                ...commentWithoutUserId,
                userName: userName,
                fullName: fullName
            };
        })
    );

    return commentsWithUserName;
}

// Create a new comment
async function createComment({ userId, recipeId, content }) {
    if (!userId || !recipeId || !content || !content.trim()) {
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }
    if (![userId, recipeId].every(id => id.match(/^[0-9a-fA-F]{24}$/)) ||
        typeof content !== 'string' || content.length > 1000) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    const comment = await commentController.create({ userId, recipeId, content: content.trim() });

    if (!comment) {
        throw new Error(ApiMessages.errorMessages.creationFailed);
    }

    // Send a notification to the recipe owner
    await addRecipeCommentedNotification(recipeId);

    return comment._id;
}

// Delete all comments related to a specific recipe
async function deleteCommentsByRecipeId(userId, recipeId) { // maybe recieve userId to confirm recipe belongs to user
    if (!userId || !recipeId) {
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }
    if (![userId, recipeId].every(id => id.match(/^[0-9a-fA-F]{24}$/))) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }
    const recipe = await recipeController.readOne({ _id: recipeId });
    if (!recipe || recipe.userId.toString() !== userId) {
        throw new Error(ApiMessages.errorMessages.unauthorized);
    }


    const result = await commentController.deleteMany({ recipeId });

    if (!result || result.deletedCount === 0) {
        throw new Error(ApiMessages.errorMessages.notFound);
    }

    return true;
}


// // Delete a comment // get also userid // unchecked code
// async function deleteComment(commentId) {
//     if (!commentId || !commentId.match(/^[0-9a-fA-F]{24}$/)) {
//         throw new Error(ApiMessages.errorMessages.invalidData);
//     }

//     const deleted = await commentController.del({ _id: commentId });

//     if (!deleted) {
//         throw new Error(ApiMessages.errorMessages.notFound);
//     }

//     return true;
// }

module.exports = {
    getRecipeComments,
    createComment,
    deleteCommentsByRecipeId
    // ,deleteComment
};
