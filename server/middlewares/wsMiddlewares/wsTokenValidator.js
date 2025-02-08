const jwt = require('jsonwebtoken')

const CustomError = require("../../utils/CustomError")

// Model
const UserModel = require('../../models/UserModel')

// Envirment variables
const SECRET = process.env.SECRET_KEY

const wsTokenValidator = async(socket, next) => {

    // Verify for postman testing
    let token_postman = socket.handshake.headers.auth_jwt

    // Verify for client application
    let cookie = socket.handshake.headers.cookie

    // Get jwt out of cookie
    let cookieArray = []
    if (cookie) cookieArray = cookie.split(' ')
    let token_client = ''

    cookieArray.forEach(cookie => {
        if (cookie.includes('jwt=')) {
            token_client = cookie.split('jwt=')[1]
        }
    });

    if (!token_postman && !token_client.length) {
        const err = new CustomError(400, 'Bad request', ['No JWT token detected'])
        return next(err)
    }

    let definitiveToken = ''

    if (token_postman) {
        definitiveToken = token_postman
    }

    if (token_client) {
        definitiveToken = token_client
    }

    try {

        const userData = jwt.verify(definitiveToken, SECRET)

        // Validate that user exists on DB
        const userFromDb = await UserModel.read({by: 'id', data: userData.userId})

        if (!userFromDb) {
            const err = new CustomError(400, 'Bad request', ['JWT gets decoded into a non existent user'])
            return next(err)
        }

/*         if (
            userFromDb.userId !== userData.userId ||
            userFromDb.username !== userData.username ||
            userFromDb.updated_at !== userData.updated_at
        ) {
            const err = new CustomError(400, 'Bad request', ['User decoded from JWT is not the same as the on in the database'])
            return next(err)
        } */

        const newUserData = {
            userId: userData.userId,
            username: userData.username,
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