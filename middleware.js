require('dotenv').config()
const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    // console.log(authHeader)
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).json({ message: 'unauthenticated'})

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // console.log(err)
        if (err) return res.status(403).json({ message: 'token invalid or expired'})
        req.user = user
        next()
    })
}