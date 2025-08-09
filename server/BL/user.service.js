const userController = require("../DL/controllers/user.controller");
const savedRecipeController = require("../DL/controllers/savedRecipe.controller");
const recipeController = require("../DL/controllers/recipe.controller");
const { addSystemNotification } = require("./notification.service.js");
const bcrypt = require('bcrypt');
const { loginAuth } = require("../middleware/auth.js");
const ApiMessages = require("../common/apiMessages.js");


async function login(userInput) {
    if (!userInput || !userInput.email || !userInput.email.trim()) {
        console.log("login: Missing required field: email");
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInput.email.trim())) {
        console.log("login: Invalid email format provided");
        throw new Error(ApiMessages.errorMessages.invalidEmail);
    }

    if (userInput.password.length < 6) {
        console.log("login: Password too weak");
        throw new Error(ApiMessages.errorMessages.passwordTooWeak);
    }

    const user = await userController.readOne({
        email: userInput.email.trim().toLowerCase()
    });

    if (!user) {
        console.log("login: User not found");
        throw new Error(ApiMessages.errorMessages.userNotFound);
    }

    if (user.status === 'blocked') {
        console.log("login: User is blocked");
        throw new Error(ApiMessages.errorMessages.forbidden);
    }

    if (user.status === 'inactive') {
        console.log("login: User is inactive");
        throw new Error(ApiMessages.errorMessages.forbidden);
    }

    const passwordMatch = await bcrypt.compare(userInput.password, user.passwordHash);
    if (!passwordMatch) {
        console.log("login: Invalid credentials");
        throw new Error(ApiMessages.errorMessages.invalidCredentials);
    }

    const token = loginAuth({ id: user._id, role: "user" });

    if (!token) {
        console.log("login: Token generation failed");
        throw new Error(ApiMessages.errorMessages.tokenInvalid);
    }

    return {
        token,
        user: {
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            savedRecipes:user.savedRecipes
        }
    };
}



async function register(body) {
    // בדיקת קלט בסיסית
    if (!body) {
        console.log("register: Missing required fields");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // בדיקות שדות חובה במשולב
    if (!body.firstName || !body.firstName.trim() ||
        !body.lastName || !body.lastName.trim() ||
        !body.username || !body.username.trim() ||
        !body.email || !body.email.trim() ||
        !body.password || !body.password.trim()) {
        console.log("register: Missing required fields");
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    // בדיקות אורך במשולב - שמות
    if (body.firstName.trim().length < 2 || body.firstName.trim().length > 50 ||
        body.lastName.trim().length < 2 || body.lastName.trim().length > 50) {
        console.log("register: Invalid firstName or lastName length");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }


    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email.trim())) {
        console.log("register: Invalid email format");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }
    if (!usernameRegex.test(body.username.trim())) {
        console.log("register: Invalid username format");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // בדיקות סיסמה במשולב
    if (body.password.length < 6) {
        console.log("register: Password too weak");
        throw new Error(ApiMessages.errorMessages.passwordTooWeak);
    }

    // בדיקת קיום משתמש - אימייל ושם משתמש במקביל
    const [existingUserByEmail, existingUserByUsername] = await Promise.all([
        userController.readOne({ email: body.email.trim().toLowerCase() }),
        userController.readOne({ username: body.username.trim() })
    ]);

    if (existingUserByEmail || existingUserByUsername) {
        console.log("register: Email or username already exists");
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
        console.log("register: user creation failed");
        throw new Error(ApiMessages.errorMessages.creationFailed);
    }

    await addSystemNotification(
        user._id,
        'משתמש חדש נרשם',
        'תודה שנרשמת! אנו מקווים שתהנה מהפלטפורמה שלנו.',
    );

    const result = {
        user: {
            id: user._id,
        }
    };

    return result;
}



async function getUser(userId) {
    if (!userId) {
        console.log("getUser: userId is required");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    if (typeof userId !== 'string' || !userId.match(/^[0-9a-fA-F]{24}$/)) {
          console.log("getUser: userId not a valid ObjectId");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // שליפת המשתמש
    const user = await userController.readOne({ _id: userId });
    if (!user) {
        console.log("getUser: user not found");
        throw new Error(ApiMessages.errorMessages.notFound);
    }

    if (user.status === 'blocked' || user.status === 'inactive') {
         console.log("getUser: user is blocked or inactive");
        throw new Error(ApiMessages.errorMessages.forbidden);
    }

    // שליפת כל הנתונים הנוספים במקביל
    const [savedCount, createdRecipesCount] = await Promise.all([
        savedRecipeController.count(userId),
        recipeController.count({ userId: userId }) // כמות המתכונים שיצר
    ]);

    // הכנת האובייקט המוחזר
    return {
        name: `${user.firstName} ${user.lastName}`,
        username: user.username,
        email: user.email,
        createdRecipesCount: createdRecipesCount,
        savedRecipesCount: savedCount
    };
}




const changePassword = async (userInput) => {
    // ולידציות בסיסיות במשולב
    console.log("userInput:", userInput);
    if (!userInput || !userInput.userId || !userInput.oldPass ||
        !userInput.newPass || !userInput.checPass) {
        console.log("changePassword: Missing required fields");
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }



    const { userId, oldPass, newPass, checPass } = userInput;

    // ולידציה של פורמט userId
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("changePassword: Invalid userId format provided");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // ולידציות סיסמאות
    if (newPass.length < 6 || checPass.length < 6) {
        console.log("changePassword: Password too weak");
        throw new Error(ApiMessages.errorMessages.passwordTooWeak);
    }

    // בדיקה שהסיסמה החדשה והאישור זהים
    if (newPass !== checPass) {
        console.log("changePassword: New password and confirmation do not match");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // שליפת המשתמש
    const user = await userController.readOne({ _id: userId });
    if (!user) {
        console.log("changePassword: User not found");
        throw new Error(ApiMessages.errorMessages.userNotFound);
    }

    // בדיקת סטטוס המשתמש
    if (user.status === 'blocked' || user.status === 'inactive') {
        console.log("changePassword: User is blocked or inactive");
        throw new Error(ApiMessages.errorMessages.forbidden);
    }

    // בדיקה שהסיסמה הנוכחית נכונה
    const passwordMatch = await bcrypt.compare(oldPass, user.passwordHash);
    if (!passwordMatch) {
        console.log("changePassword: Invalid credentials");
        throw new Error(ApiMessages.errorMessages.invalidCredentials);
    }

    // הצפנת הסיסמה החדשה
    const newPasswordHash = await bcrypt.hash(newPass, 10);

    // עדכון הסיסמה במסד הנתונים
    const updatedUser = await userController.update(
        { _id: userId },
        { passwordHash: newPasswordHash }
    );

    if (!updatedUser) {
        console.log("changePassword: Failed to update password");
        throw new Error(ApiMessages.errorMessages.updateFailed);
    }

    return {
        data: { userId: userId }
    };
};


const changeDetails = async (userInput) => {
    // ולידציות בסיסיות
    if (!userInput || !userInput.userId) {
        console.log("changeDetails: Missing required field: userId");
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    const { userId, fullName, newEmail } = userInput;

    // בדיקה שיש לפחות שדה אחד לעדכון
    if (!fullName && !newEmail) {
        console.log("changeDetails: No fields to update");
        throw new Error(ApiMessages.errorMessages.badRequest);
    }

    // ולידציה של פורמט userId
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("changeDetails: Invalid userId format provided");
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // שליפת המשתמש
    const user = await userController.readOne({ _id: userId });
    if (!user) {
        console.log("changeDetails: User not found");
        throw new Error(ApiMessages.errorMessages.userNotFound);
    }

    // בדיקת סטטוס המשתמש
    if (user.status === 'blocked' || user.status === 'inactive') {
        console.log("changeDetails: User is blocked or inactive");
        throw new Error(ApiMessages.errorMessages.forbidden);
    }

    const updateData = {};

    // טיפול בעדכון השם המלא
    if (fullName && fullName.trim()) {
        const nameParts = fullName.trim().split(' ');

        // בדיקה שיש לפחות שני חלקים (שם פרטי ומשפחה)
        if (nameParts.length < 2) {
            console.log("changeDetails: Full name must contain at least first name and last name");
            throw new Error(ApiMessages.errorMessages.invalidData);
        }

        // החלק הראשון הוא השם הפרטי, השאר הם שם משפחה
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');

        // ולידציות אורך
        if (firstName.length < 2 || firstName.length > 50 ||
            lastName.length < 2 || lastName.length > 50) {
            console.log("changeDetails: Invalid firstName or lastName length");
            throw new Error(ApiMessages.errorMessages.invalidData);
        }

        updateData.firstName = firstName;
        updateData.lastName = lastName;
    }

    // טיפול בעדכון האימייל
    if (newEmail && newEmail.trim()) {
        const email = newEmail.trim().toLowerCase();

        // ולידציה של פורמט אימייל
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email) || email.length > 100) {
            console.log("changeDetails: Invalid email format provided");
            throw new Error(ApiMessages.errorMessages.invalidEmail);
        }

        // בדיקה שהאימייל לא קיים במערכת (אם הוא שונה מהנוכחי)
        if (email !== user.email.toLowerCase()) {
            const existingUser = await userController.readOne({ email: email });
            if (existingUser) {
                console.log("changeDetails: Email already exists");
                throw new Error(ApiMessages.errorMessages.emailAlreadyExists);
            }
            updateData.email = email;
        }
    }

    // בדיקה שיש משהו לעדכן
    if (Object.keys(updateData).length === 0) {
        console.log("changeDetails: No valid fields to update");
        throw new Error(ApiMessages.errorMessages.badRequest);
    }

    // עדכון הפרטים במסד הנתונים
    const updatedUser = await userController.update({ _id: userId }, updateData);

    if (!updatedUser) {
        console.log("changeDetails: Failed to update user details");
        throw new Error(ApiMessages.errorMessages.updateFailed);
    }

    return {
        data: {
            userId: userId,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email
        }
    };
};


module.exports = { login, register, getUser, changePassword, changeDetails };