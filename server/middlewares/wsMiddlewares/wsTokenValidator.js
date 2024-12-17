const jwt = require('jsonwebtoken')

const CustomError = require("../../utils/CustomError")

// Envirment variables
const SECRET = process.env.SECRET_KEY

const wsTokenValidator = (socket, next) => {

    // Verify if token exists on connection headers
    const token = socket.handshake.headers.auth_jwt

    if (!token) {
        const err = new CustomError(400, 'Bad request', ['No JWT token detected'])
        return next(err)
    }

    try {

        const userData = jwt.verify(token, SECRET)

        // Validate that user exists on DB
        // ....
    
        const newUserData = {
            userId: userData.userId,
            username: userData.username,
            email: userData.email
        }
    
        socket.user = newUserData
    
        next()

    } catch (error) {

        // Add error logger here
        //console.error(error)

        if (error.name === 'TokenExpiredError') {
            const err = new CustomError(403, 'Forbidden', ['Token expired'])
            return next(err)
        }

        if (error.name === 'JsonWebTokenError') {
            const err = new CustomError(401, 'Unauthorized', ['Token invalid'])
            return next(err)
        }

        const err = new CustomError(500, 'Server error', ['Something went wrong. Try again later'])
        return next(err)

    }


}

module.exports = wsTokenValidator