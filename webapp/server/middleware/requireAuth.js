/**
 * requireAuth.js
 * ----------------
 * Middleware that authenticates incoming requests using a JWT stored in cookies.
 *
 * - Reads the token from `req.cookies.Authorization`
 * - Verifies the token using the secret defined in `process.env.SECRET`
 * - Checks for expiration
 * - Retrieves the user from the database using the token's `sub` claim
 * - Attaches the user to `req.user` if authentication succeeds
 * - Sends a 401 Unauthorized response if the token is missing, invalid, expired, or user not found
 *
 * Used to protect private routes that require a logged-in user.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/user');

async function requireAuth(req, res, next) {
    try {
        // Read token off cookies
        const token = req.cookies.Authorization; 

        // Decode the token 
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