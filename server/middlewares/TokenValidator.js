// For session management
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET_KEY

function tokenValidator (req, res, next) {

    try {

        const token = req.cookies.jwt
        const userDecoded = jwt.verify(token, SECRET)

        // Validate that user exists on DB
        // ...

        req.user = userDecoded
        next()

    } catch (error) {

        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({
                message: 'Forbidden',
                details: ['Token expired']
            })
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Unauthorized',
                details: ['Token invalid']
            })
        }

        // Add error logger here
        console.error(error)

        return res.status(500).json({
            message: 'Server error',
            details: ['Something went wrong. Try again later']
        })
    }
}

module.exports = tokenValidator