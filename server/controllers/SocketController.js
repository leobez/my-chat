// Service
// ...

// Model
const UserModel = require("../models/UserModel");

// Custom error
const CustomError = require("../utils/CustomError");

// Controller
class SocketController {

    static sendPrivateMessage = async(data) => {

        try {
            // Find socketId of user thats receiving the message
            const receivingUser = await UserModel.read({by: 'id', data: data.data.to_user})

            // User doesnt have a socket, which means he inst online at the moment
            if (!receivingUser.socketId) return;

            console.log('Transmitting: ', data)
            return socket.to(receivingUser.socketId).emit('private message', data)

        } catch (error) {
            // Add error logger here
            const err = new CustomError(500, 'Server error', ['Try again later'])
            return socket.to(message.from_user).emit('private message error', err)
        } 

    }

}

module.exports = SocketController