const userController = require("../DL/controllers/user.controller");
const savedRecipeController = require("../DL/controllers/savedRecipe.controller");
const bcrypt = require('bcrypt');
const { loginAuth } = require("../middleware/auth.js");
const ApiMessages = require("../common/apiMessages.js");


async function login(userInput) {
    if (!userInput || !userInput.email || !userInput.email.trim()) {
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInput.email.trim())) {
        throw new Error(ApiMessages.errorMessages.invalidEmail);
    }

    if (userInput.password.length < 6) {
        throw new Error(ApiMessages.errorMessages.passwordTooWeak);
    }

    const user = await userController.readOne({ 
        email: userInput.email.trim().toLowerCase() 
    });

    if (!user) {
        throw new Error(ApiMessages.errorMessages.userNotFound);
    }

    if (user.status === 'blocked') {
        throw new Error(ApiMessages.errorMessages.forbidden);
    }

    if (user.status === 'inactive') {
        throw new Error(ApiMessages.errorMessages.forbidden);
    }

    const passwordMatch = await bcrypt.compare(userInput.password, user.passwordHash);
    if (!passwordMatch) {
        throw new Error(ApiMessages.errorMessages.invalidCredentials);
    }

    const token = loginAuth({ id: user._id });

    if (!token) {
        throw new Error(ApiMessages.errorMessages.tokenInvalid);
    }

    return { 
        token,
        user: {
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        }
    };
}



async function register(body) {
    // בדיקת קלט בסיסית
    if (!body) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // בדיקות שדות חובה במשולב
    if (!body.firstName || !body.firstName.trim() || 
        !body.lastName || !body.lastName.trim() || 
        !body.username || !body.username.trim() || 
        !body.email || !body.email.trim() || 
        !body.password || !body.password.trim()) {
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    // בדיקות אורך במשולב - שמות
    if (body.firstName.trim().length < 2 || body.firstName.trim().length > 50 ||
        body.lastName.trim().length < 2 || body.lastName.trim().length > 50) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

 
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email.trim()) || !usernameRegex.test(body.username.trim())) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // בדיקות סיסמה במשולב
    if (body.password.length < 6) {
        throw new Error(ApiMessages.errorMessages.passwordTooWeak);
    }

    // בדיקת קיום משתמש - אימייל ושם משתמש במקביל
    const [existingUserByEmail, existingUserByUsername] = await Promise.all([
        userController.readOne({ email: body.email.trim().toLowerCase() }),
        userController.readOne({ username: body.username.trim() })
    ]);

    if (existingUserByEmail || existingUserByUsername) {
        if (existingUserByEmail) throw new Error(ApiMessages.errorMessages.emailAlreadyExists);
        if (existingUserByUsername) throw new Error(ApiMessages.errorMessages.userAlreadyExists);
    }

    // הכנת נתוני המשתמש
    const userInput = {
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
        username: body.username.trim(),
        email: body.email.trim().toLowerCase(),
        passwordHash: await bcrypt.hash(body.password, 10),
        profileImageUrl: body.profileImageUrl || "https://st.depositphotos.com/1787196/1330/i/450/depositphotos_13303160-stock-illustration-funny-chef-and-empty-board.jpg"
    };

    const user = await userController.create(userInput);
    if (!user) {
        throw new Error(ApiMessages.errorMessages.creationFailed);
    }

    const result = { 
        user: { 
            id: user._id,
        } 
    };
    
    return result;
}



// async function getUser(userId) {
//     const user = await userController.readOne({ _id: userId });
//     const savedCount = await savedRecipeController.count({ _id: userId });
//     user.savedRecipeCount = savedCount;
//     return user;
// }



async function getUser(userId) {
    if (!userId) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    if (typeof userId !== 'string' || !userId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // שליפת המשתמש
    const user = await userController.readOne({ _id: userId });
    if (!user) {
        throw new Error(ApiMessages.errorMessages.badRequest);
    }

    if (user.status === 'blocked' || user.status === 'inactive') {
        throw new Error(ApiMessages.errorMessages.forbidden);
    }

    const savedCount = await savedRecipeController.count(userId);
    const userObj = user.toObject ? user.toObject() : { ...user };
    userObj.savedRecipeCount = savedCount;
    const { passwordHash, ...safeUser } = userObj;
    return safeUser;
}



module.exports = { login, register, getUser };