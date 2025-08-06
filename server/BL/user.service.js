const userController = require("../DL/controllers/user.controller");
const savedRecipeController = require("../DL/controllers/savedRecipe.controller");
const recipeController = require("../DL/controllers/recipe.controller");
const { addSystemNotification } = require("./notification.service.js");
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

    await addSystemNotification(
        user._id,
        "New user registered",
        "Thank you for registering! We hope you enjoy our platform."
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
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    if (typeof userId !== 'string' || !userId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // שליפת המשתמש
    const user = await userController.readOne({ _id: userId });
    if (!user) {
        throw new Error(ApiMessages.errorMessages.notFound);
    }

    if (user.status === 'blocked' || user.status === 'inactive') {
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
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }



    const { userId, oldPass, newPass, checPass } = userInput;

    // ולידציה של פורמט userId
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // ולידציות סיסמאות
    if (newPass.length < 6 || checPass.length < 6) {
        throw new Error(ApiMessages.errorMessages.passwordTooWeak);
    }

    // בדיקה שהסיסמה החדשה והאישור זהים
    if (newPass !== checPass) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // שליפת המשתמש
    const user = await userController.readOne({ _id: userId });
    if (!user) {
        throw new Error(ApiMessages.errorMessages.userNotFound);
    }

    // בדיקת סטטוס המשתמש
    if (user.status === 'blocked' || user.status === 'inactive') {
        throw new Error(ApiMessages.errorMessages.forbidden);
    }

    // בדיקה שהסיסמה הנוכחית נכונה
    const passwordMatch = await bcrypt.compare(oldPass, user.passwordHash);
    if (!passwordMatch) {
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
        throw new Error(ApiMessages.errorMessages.updateFailed);
    }

    return {
        data: { userId: userId }
    };
};


const changeDetails = async (userInput) => {
    // ולידציות בסיסיות
    if (!userInput || !userInput.userId) {
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    const { userId, fullName, newEmail } = userInput;

    // בדיקה שיש לפחות שדה אחד לעדכון
    if (!fullName && !newEmail) {
        throw new Error(ApiMessages.errorMessages.badRequest);
    }

    // ולידציה של פורמט userId
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(ApiMessages.errorMessages.invalidData);
    }

    // שליפת המשתמש
    const user = await userController.readOne({ _id: userId });
    if (!user) {
        throw new Error(ApiMessages.errorMessages.userNotFound);
    }

    // בדיקת סטטוס המשתמש
    if (user.status === 'blocked' || user.status === 'inactive') {
        throw new Error(ApiMessages.errorMessages.forbidden);
    }

    const updateData = {};

    // טיפול בעדכון השם המלא
    if (fullName && fullName.trim()) {
        const nameParts = fullName.trim().split(' ');

        // בדיקה שיש לפחות שני חלקים (שם פרטי ומשפחה)
        if (nameParts.length < 2) {
            throw new Error(ApiMessages.errorMessages.invalidData);
        }

        // החלק הראשון הוא השם הפרטי, השאר הם שם משפחה
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');

        // ולידציות אורך
        if (firstName.length < 2 || firstName.length > 50 ||
            lastName.length < 2 || lastName.length > 50) {
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
            throw new Error(ApiMessages.errorMessages.invalidEmail);
        }

        // בדיקה שהאימייל לא קיים במערכת (אם הוא שונה מהנוכחי)
        if (email !== user.email.toLowerCase()) {
            const existingUser = await userController.readOne({ email: email });
            if (existingUser) {
                throw new Error(ApiMessages.errorMessages.emailAlreadyExists);
            }
            updateData.email = email;
        }
    }

    // בדיקה שיש משהו לעדכן
    if (Object.keys(updateData).length === 0) {
        throw new Error(ApiMessages.errorMessages.badRequest);
    }

    // עדכון הפרטים במסד הנתונים
    const updatedUser = await userController.update({ _id: userId }, updateData);

    if (!updatedUser) {
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