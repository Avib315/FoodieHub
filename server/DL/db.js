const mongoose = require("mongoose")

const connect = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI).then(() => {
            console.log(`\x1b[42m [db.js] connected to DB \x1b[0m`);
        })
    } catch (error) {
        console.error(error);
    }
}
module.exports = { connect }