// Models
const UserModel = require('../../models/UserModel')
const CustomError = require('../../utils/CustomError')

// Map userId to their corresponding socketId on Database
const sanitizeWsContent = async(socket, next) => {

    try {

       

    } catch (error) {
        // Add error logger here
        const err = new CustomError(500, 'Server error', ['Try again later'])
        next(err)
    }
    next()
}

module.exports = sanitizeWsContent