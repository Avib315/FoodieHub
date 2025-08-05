const userController = require("../DL/controllers/user.controller");
const savedRecipeController = require("../DL/controllers/savedRecipe.controller");
const bcrypt = require('bcrypt');
const { loginAuth } = require("../middleware/auth.js");
const ApiMessages = require("../common/apiMessages.js");


// async function login(userInput) {
//     const user = await userController.readOne({ email: userInput.email });
//     if (!user ) return { success: false, message: ApiMessages.errorMessages.forbidden };
//     if (!userInput.password) return { success: false, message: ApiMessages.errorMessages.forbidden };
//     const passwordMatch = await bcrypt.compare(userInput.password, user?.passwordHash);
//     if (!passwordMatch) return { success: false, message: ApiMessages.errorMessages.forbidden };
//     const token = loginAuth({ id: user._id });
//     console.log(1111);
//     return { success: true, token };
// }


async function login(userInput) {
    if (!userInput || !userInput.email || !userInput.email.trim()) {
        throw new Error(ApiMessages.errorMessages.missingData || !userInput.password || userInput.password.trim() === '');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInput.email.trim())) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // בדיקת אורך סיסמה מינימלי
    if (userInput.password.length < 6) {
        throw new Error(ApiMessages.errorMessages.shortPassword || "Password must be at least 6 characters");
    }
    
    // חיפוש המשתמש במסד הנתונים
    const user = await userController.readOne({ 
        email: userInput.email.trim().toLowerCase() 
    });

    if (!user) {
        throw new Error(ApiMessages.errorMessages.userNotFound || "Invalid email or password");
    }

    // בדיקת סטטוס המשתמש
    if (user.status === 'blocked') {
        throw new Error(ApiMessages.errorMessages.userBlocked || "Account is blocked");
    }

    if (user.status === 'inactive') {
        throw new Error(ApiMessages.errorMessages.userInactive || "Account is inactive");
    }

    // בדיקת תקינות הסיסמה
    const passwordMatch = await bcrypt.compare(userInput.password, user.passwordHash);
    if (!passwordMatch) {
        throw new Error(ApiMessages.errorMessages.invalidCredentials || "Invalid email or password");
    }

    // יצירת JWT token
    const token = loginAuth({ 
        id: user._id,
        email: user.email,
        role: user.role 
    });

    if (!token) {
        throw new Error(ApiMessages.errorMessages.tokenError || "Failed to generate token");
    }

    console.log(`✅ User logged in successfully: ${user.email}`);

    // החזרת תשובה מוצלחת
    return { 
        success: true, 
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        }
    };
}





async function register(body) {
    const userInput = {
        firstName: body?.firstName?.trim(),
        lastName: body?.lastName?.trim(),
        username: body.username ,
        email: body?.email,
        passwordHash: await bcrypt.hash(body?.password, 10),
        profileImageUrl: body?.profileImageUrl || "https://st.depositphotos.com/1787196/1330/i/450/depositphotos_13303160-stock-illustration-funny-chef-and-empty-board.jpg"
    };
    if(!userInput.firstName || !userInput.lastName || !userInput.email || !userInput.passwordHash || !userInput.username   ) {
        return { register: false, message: "נא למלא את כל השדות" };
    }
    const user = await userController.create(userInput);
    if (!user) return false;
    const result = { register: true, message: "נוסף בהצלחה", user: { email: user.email, name: user.firstName + " " + user.lastName, lists: user.lists } };
    return result;
}
async function getUser(userId) {
    const user = await userController.readOne({ _id: userId });
    const savedCount = await savedRecipeController.count({ _id: userId });
    user.savedRecipeCount = savedCount;
    return user;
}
module.exports = { login, register, getUser };