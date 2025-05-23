const User = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function signup(req, res) {
    try {
        // Get the email and password off req body 
        const {email, password } = req.body; 

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 8);

        // Create a user with the data
        await User.create({email, password: hashedPassword});

        // respond
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
    
}

async function login(req, res) {
    try {
        // Get the email and password off request body
        const {email, password} = req.body

        // Find the user with the requested email
        const user = await User.findOne({email});
        if(!user) return res.sendStatus(400); // user does not exist 

        // Compare sent in password with found user password 
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) return res.sendStatus(401); // password is not a match

        // Create a jwt token 
        const exp = Date.now() + 1000 * 60 * 60 * 24 * 30; // expiry date
        const token = jwt.sign({sub: user._id, exp}, process.env.SECRET);

        // Set the secure cookie 
        res.cookie("Authorization", token, {
            expires: new Date(exp),
            httpOnly: true,
            sameSite: 'lax', 
            secure: process.env.NODE_ENV === 'production',
        });

        // Send the jwt token
        res.sendStatus(200); // success
    } catch (err) {
        console.log(err)
        res.sendStatus(400); // server unable to process a request
    }
}

function logout(req, res) {
    try {
        res.clearCookie("Authorization");
        res.sendStatus(200); // success
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
}

function checkAuth(req, res) {
    try {
        res.sendStatus(200); // success
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

module.exports = {
    signup, 
    login, 
    logout,
    checkAuth,
};
