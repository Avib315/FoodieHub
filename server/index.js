const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { auth } = require("./middleware/auth.js");
require("dotenv").config();

// Initialize database connection
try {
    require("./DL/db.js").connect();
} catch (error) {
    console.log("Database connection error:", error);
}

const app = express();

// Define allowed origins
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://foodie-hub-9rht.vercel.app',  // Your client
    'https://foodie-hub-9rht-57qwciafl-avib315s-projects.vercel.app'
];

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['set-cookie']
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Add a simple root route for testing
app.get('/', (req, res) => {
    res.json({ 
        message: 'Foodie Hub API is running!', 
        timestamp: new Date().toISOString(),
        cors: 'enabled'
    });
});

// Your API routes
// app.use("/", require("./routes/base.router.js"));
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`\x1b[42m [index.js] server is running on port ${PORT} \x1b[0m`);
    });
}

// Export for Vercel
module.exports = app;