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
                req.user = user;
                req.body.userId = user.id; 

                
                next();
            }
        });
    } catch (error) {
        console.error("Authentication Middleware Error:", error); 
        res.status(500).send({ message: 'Internal server error.' });
    }
}
// Admin-only authentication middleware
async function adminAuth(req, res, next) {
    try {
        let token = req.cookies.token; 
        if (!token) {
            return res.status(403).send({ message: 'No token provided.' });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).send({ message: 'Failed to authenticate token.' });
            }
            console.log(user.role);
            
            if (user.role !== 'admin') {
                return res.status(403).send({ message: 'Access denied. Admin role required.' });
            }
            req.user = user;
            req.body.userId = user.id;
            next();
        });
    } catch (error) {
        console.error("Admin Authentication Middleware Error:", error); 
        res.status(500).send({ message: 'Internal server error.' });
    }
}
 function loginAuth(data) {
    const token = jwt.sign({...data, role:"user"}, process.env.JWT_SECRET, { expiresIn: "36h" });
    return token;
}
 function loginAdminAuth(data) {
    const token = jwt.sign({...data, role:"admin"}, process.env.JWT_SECRET, { expiresIn: "36h" });
    return token;
}

module.exports = { auth, loginAuth , loginAdminAuth , adminAuth };