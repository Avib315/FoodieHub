const userController = require("../DL/controllers/user.controller");
const bcrypt = require('bcrypt');
const { loginAuth } = require("../middleware/auth.js");
const ApiMessages = require("../common/apiMessages.js");


async function login(userInput) {
    const user = await userController.readOne({ email: userInput.email });
    if (!user ) return { success: false, message: ApiMessages.errorMessages.forbidden };
    if (!userInput.password) return { success: false, message: ApiMessages.errorMessages.forbidden };
    const passwordMatch = await bcrypt.compare(userInput.password, user?.passwordHash);
    if (!passwordMatch) return { success: false, message: ApiMessages.errorMessages.forbidden };
    const token = loginAuth({ id: user._id });
    console.log(1111);
    return { success: true, token };
}
async function register(body) {
    const userInput = {
        firstName: body?.firstName?.trim(),
        lastName: body?.lastName?.trim(),
        username: body.userName || "user1",
        email: body?.email,
        passwordHash: await bcrypt.hash(body?.password, 10),
        profileImageUrl: body?.profileImageUrl || "https://st.depositphotos.com/1787196/1330/i/450/depositphotos_13303160-stock-illustration-funny-chef-and-empty-board.jpg"
    };
    const user = await userController.create(userInput);
    if (!user) return false;
    const result = { register: true, message: "נוסף בהצלחה", user: { email: user.email, name: user.firstName + " " + user.lastName, lists: user.lists } };
    return result;
}
async function getUser(userId) {
    const user = await userController.readOne({ _id: userId });
    const savedCount = await userController.count({ _id: userId });
    user.savedRecipeCount = savedCount;
    return user;
}
module.exports = { login, register, getUser };