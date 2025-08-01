const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { auth } = require("./middleware/auth.js");
require("dotenv").config();
require("./DL/db.js").connect();

const app = express();
const PORT = 3001;

app.use(cors({
    origin: '*',
    credentials: true
    }));
    app.use(express.json());
    app.use(cookieParser());

app.use("/api/user", require("./routes/user.router.js"));
app.use("/api/recipe", require("./routes/recipe.router.js"));
// app.use("/api/categories", require("./routes/categories.router.js"));
// app.use("/api/items", auth, require("./routes/userItems.router.js"));

app.listen(process.env.PORT, () => {
    console.log(`\x1b[42m [index.js] server is running on port ${PORT} \x1b[0m`);
});
