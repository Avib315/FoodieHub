const jwt = require('jsonwebtoken');

async function auth(req, res, next) {
    try {
        let token = req.cookies.token; 
        if (!token) {
            return res.status(403).send({ message: 'No token provided.' });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).send({ message: 'Failed to authenticate token.' });
            } else {
                req.body.userId = user.id; 
                next();
            }
        });
    } catch (error) {
        console.error("Authentication Middleware Error:", error); 
        res.status(500).send({ message: 'Internal server error.' });
    }
}

 function loginAuth(data) {
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "5d" });
    return token;
}

module.exports = { auth, loginAuth };
