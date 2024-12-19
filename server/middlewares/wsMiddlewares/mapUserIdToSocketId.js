// Models
const UserModel = require('../../models/UserModel')
const CustomError = require('../../utils/CustomError')

// Map userId to their corresponding socketId on Database
const mapUserIdToSocketId = async(socket, next) => {

    try {

        console.log(`Mapping [userId: ${socket.user.userId}] to [socketId: ${socket.id}]`)

        await UserModel.update({
            fieldsToBeUpdated: ['socketId'],
            newData: [socket.id],
            whereUserId: socket.user.userId
        })

    } catch (error) {
        // Add error logger here
        const err = new CustomError(500, 'Server error', ['Try again later'])
        next(err)
    }
    next()
}

module.exports = mapUserIdToSocketId