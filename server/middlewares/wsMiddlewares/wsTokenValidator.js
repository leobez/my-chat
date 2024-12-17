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
}

module.exports = wsTokenValidator