const jwt = require('jsonwebtoken')
const secret = process.env.SECRET_KEY

const tokenVerifier = (req, res, next) => {

    try {
        
        const token = req.cookies.jwt

        if (!token) {
            return res.status(401).json({loggedIn: false, message: 'Invalid session token', details: ['JWT cookie does not exist']})
        }

        const userDecoded = jwt.verify(token, secret)
        req.data = userDecoded
        next()

    } catch (error) {
        console.log(error)
        return res.status(401).json({loggedIn: false, message: 'Invalid session token', details: ['Invalid JWT token']})
    }
}

module.exports = tokenVerifier