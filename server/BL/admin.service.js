const adminController = require("../DL/controllers/admin.controller.js");
const bcrypt = require('bcrypt');
const { loginAuth } = require("../middleware/auth.js");
const ApiMessages = require("../common/apiMessages.js");

async function login(adminInput) {
    const admin = await adminController.readOne({ email: adminInput.email });
    if (!admin ) return { success: false, message: ApiMessages.errorMessages.forbidden };
    if (!adminInput.password) return { success: false, message: ApiMessages.errorMessages.forbidden };
    const passwordMatch = await bcrypt.compare(adminInput.password, admin?.passwordHash);
    if (!passwordMatch) return { success: false, message: ApiMessages.errorMessages.forbidden };

    const token = loginAuth({ id: admin._id });
    return { success: true, token };
}

//// action

module.exports = { login };