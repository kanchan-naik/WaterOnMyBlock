const jwt = require('jsonwebtoken');
const { rawListeners } = require('../models/annotation');
const User = require('../models/user');

async function requireAuth(req, res, next) {
    try {
        // Read token off cookies
        const token = req.cookies.Authorization; 

        // Decode the token 
        //console.log("JWT_SECRET:", process.env.SECRET);
        const decoded = jwt.verify(token, process.env.SECRET);

        // Check expiration
        if(Date.now() > decoded.exp)
        {
            return res.sendStatus(401); // invalid credentials error
        }

        // Find user using decoded sub
        const user = await User.findById(decoded.sub) // attach user to req
        if (!user) return res.sendStatus(401);

        // Attach user to req
        req.user = user;

        // Continue on
        next();
    } catch (err) {
        return res.sendStatus(401);
    }
}

module.exports = requireAuth;