const recipeModel = require('../models/recipe.model.js');

const create = async (data, isPopulate) => {
    return await recipeModel.create(data);
}

const read = async (filter) => {
    return await recipeModel.find(filter);
}

const readOne = async (filter) => { // {_id:2}
    return await recipeModel.findOne(filter);
}

const update = async (filter, data) => {
    return await recipeModel.findOneAndUpdate(filter, data);
}

const del = async (filter) => {
    return await recipeModel.findOneAndDelete(filter);
}

const readWithUserAndRatings = async (filter = {}) => {
    return await recipeModel.aggregate([
        // שלב 1: סינון (אם יש)
        { $match: filter },
        
        // שלב 2: חיבור עם טבלת המשתמשים
        {
            $lookup: {
                from: 'users', // שם הקולקשן של המשתמשים (בדוק שזה הנכון)
                localField: 'userId',
                foreignField: '_id',
                as: 'userInfo'
            }
        },
        
        // שלב 3: חיבור עם טבלת הדירוגים
        {
            $lookup: {
                from: 'ratings', // שם הקולקשן של הדירוגים (בדוק שזה הנכון)
                localField: '_id',
                foreignField: 'recipeId',
                as: 'ratings'
            }
        },
        
        // שלב 4: הוספת שדות מחושבים
        {
            $addFields: {
                username: { 
                    $ifNull: [
                        { $arrayElemAt: ['$userInfo.username', 0] }, // או username אם זה השדה שלך
                        'Unknown User'
                    ]
                },
                averageRating: {
                    $cond: {
                        if: { $gt: [{ $size: '$ratings' }, 0] },
                        then: { 
                            $round: [
                                { $avg: '$ratings.rating' }, 
                                1
                            ]
                        },
                        else: 0
                    }
                },
                totalRatings: { $size: '$ratings' }
            }
        },
        
        // שלב 5: הסרת שדות מיותרים
        {
            $project: {
                userInfo: 0,
                ratings: 0,
                userId: 0 // מסיר את userId מהתוצאה
            }
        },
        
        // שלב 6: מיון (אופציונלי)
        { $sort: { createdAt: -1 } }
    ]);
};

module.exports = {
    create,
    read,
    readOne,
    update,
    del,
    readWithUserAndRatings
}
