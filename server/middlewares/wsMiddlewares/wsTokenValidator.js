const jwt = require('jsonwebtoken')

const CustomError = require("../../utils/CustomError")

// Model
const UserModel = require('../../models/UserModel')

// Envirment variables
const SECRET = process.env.SECRET_KEY

const wsTokenValidator = async(socket, next) => {

    // Verify if token exists on connection headers
    const token = socket.handshake.headers.auth_jwt

    if (!token) {
        const err = new CustomError(400, 'Bad request', ['No JWT token detected'])
        return next(err)
    }

    try {

        const userData = jwt.verify(token, SECRET)

        // Validate that user exists on DB
        const userFromDb = await UserModel.read({by: 'id', data: userData.userId})

        if (!userFromDb) {
            const err = new CustomError(400, 'Bad request', ['JWT gets decoded into a non existent user'])
            return next(err)
        }

/*         if (
            userFromDb.userId !== userData.userId ||
            userFromDb.email !== userData.email ||
            userFromDb.username !== userData.username ||
            userFromDb.updated_at !== userData.updated_at
        ) {
            const err = new CustomError(400, 'Bad request', ['User decoded from JWT is not the same as the on in the database'])
            return next(err)
        } */

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