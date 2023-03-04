const jwt = require("jsonwebtoken");
require("dotenv").config();

let TOKEN_KEY = process.env.TOKEN_KEY;

const verifyToken = (req, res, next) => {
    const bearerHeadeer = req.headers['authorization'];
    if (typeof bearerHeadeer !== 'undefined') {
        try {
            const bearer = bearerHeadeer.split(' ');
            const token = bearer[1];
            const authData = jwt.verify(token, TOKEN_KEY);
            req.user = authData;
        } catch (err) {
            return res.status(401).send("Invalid Token");
        }
        return next();
    }
    else
    {
        return res.sendStatus(403);
    }    
};

module.exports = verifyToken;