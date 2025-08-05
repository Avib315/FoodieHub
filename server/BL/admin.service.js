const adminController = require("../DL/controllers/admin.controller.js");
const bcrypt = require('bcrypt');
const { loginAuth } = require("../middleware/auth.js");
const ApiMessages = require("../common/apiMessages.js");

async function login(adminInput) {
    if (!adminInput || !adminInput.email || !adminInput.email.trim() ||
        !adminInput.password || adminInput.password.trim() === '') {
        throw new Error(ApiMessages.errorMessages.missingRequiredFields);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminInput.email.trim())) {
        throw new Error(ApiMessages.errorMessages.invalidEmail);
    }

    if (adminInput.password.length < 6) {
        throw new Error(ApiMessages.errorMessages.passwordTooWeak);
    }

    const admin = await adminController.readOne({ email: adminInput.email });

    if (!admin) { throw new Error(ApiMessages.errorMessages.userNotFound); }
    const passwordMatch = await bcrypt.compare(adminInput.password, admin?.passwordHash);
    if (!passwordMatch) { throw new Error(ApiMessages.errorMessages.invalidCredentials); }

    const token = loginAuth({ id: admin._id });

    if (!token) {
        throw new Error(ApiMessages.errorMessages.serverError);
    }
    return {
        token,
        admin: {
            username: admin.username,
            email: admin.email,
            firstName: admin.firstName,
            lastName: admin.lastName
        }
    };
}

//// action

module.exports = { login };