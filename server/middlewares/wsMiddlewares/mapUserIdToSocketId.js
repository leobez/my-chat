const {getSocketInfo, getSocketIdByUserId, updateSocketId} = require('../../utils/userWrapper')

// Map userId to their corresponding socketId
const mapUserIdToSocketId = async(socket, next) => {
    // Add socketId on database
    try {
        console.log(`Mapping [userId: ${socket.user.userId}] to [socketId: ${socket.id}]`)
        await updateSocketId(socket.user.userId, socket.id)
        await getSocketInfo()
    } catch (error) {
        const err = new Error('Server error')
        err.data = {details: ['Failed to map userId to socketId']}
        return next(err)
    }
    next()
}

module.exports = mapUserIdToSocketId