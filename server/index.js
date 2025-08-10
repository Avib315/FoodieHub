const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { auth } = require("./middleware/auth.js");
require("dotenv").config();
require("./DL/db.js").connect();

const app = express();
const PORT = process.env.PORT || 3001;


const allowedOrigins = [
    'http://localhost:5173',                 
    'http://localhost:3000',                   
    'https://foodie-hub-9rht.vercel.app',      
    'https://foodie-hub-9rht-57qwciafl-avib315s-projects.vercel.app' 
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/", require("./routes/base.router.js"));
app.use("/api/main", require("./routes/main.router.js"));
app.use("/api/user", require("./routes/user.router.js"));
app.use("/api/recipe", require("./routes/recipe.router.js"));
app.use("/api/comment", require("./routes/comment.router.js"));
app.use("/api/savedRecipe", require("./routes/savedRecipe.router.js"));
app.use("/api/rating", require("./routes/rating.router.js"));
app.use("/api/categories", require("./routes/categories.router.js"));
app.use("/api/notification", require("./routes/notification.router.js"));
app.use("/api/adminLog", require("./routes/adminLog.router.js"));
app.use("/api/admin", require("./routes/admin.router.js"));

app.listen(PORT, () => {
    console.log(`\x1b[42m [index.js] server is running on port ${PORT} \x1b[0m`);
});