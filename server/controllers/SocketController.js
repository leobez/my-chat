// Service
// ...
const {getSocketInfo, getSocketIdByUserId, updateSocketId} = require('./utils/userWrapper')

// Controller
class SocketController {

    static sendPrivateMessage = async({message}) => {

        const receiverUserId = message.to_user

        try {
            const receiverSockerId = await getSocketIdByUserId(receiverUserId)
            console.log(`Transmitting message [${message.content}] to socket: ${receiverSockerId.socketId}`)
            return socket.to(receiverSockerId.socketId).emit('private message', message)
        } catch (error) {
            console.log(error)
            const err = new Error('Server error')
            err.data = {details: error}
            return socket.to(message.from_user).emit('connect_error', err)
        }

    }

}

module.exports = SocketController