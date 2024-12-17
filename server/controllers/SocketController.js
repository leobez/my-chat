// Service
// ...

// Model
const UserModel = require("../models/UserModel");

// Custom error
const CustomError = require("../utils/CustomError");

// Controller
class SocketController {

    static disconnect = async(socket) => {
        try {
            console.log(`User: ${socket.user.userId} DISCONNECTED.`)
            await UserModel.update(null, socket.user.userId)
            return;
        } catch (error) {
            // Add error logger here
            //const err = new CustomError(500, 'Server error', ['Try again later'])
            //return socket.to(message.from_user).emit('private message error', err)
            return;
        }  

    }

    static sendPrivateMessage = async(socket, {data}) => {

        try {

            // Find socketId of user thats receiving the message
            const receivingUser = await UserModel.read({by: 'id', data: data.to_user})

            // User doesnt have a socket, which means he inst online at the moment
            if (!receivingUser.socketId) return;

            console.log('Transmitting: ', data)
            return socket.to(receivingUser.socketId).emit('private message', data)

        } catch (error) {

            // Add error logger here
            const err = new CustomError(500, 'Server error', ['Try again later'])

            // Find socketId of user thats sending the message (notify him of error)
            const sendingUser = await UserModel.read({by: 'id', data: data.from_user})
            if (!sendingUser.socketId) return;
            //console.log('testing error: ', sendingUser.socketId)
            return socket.to(sendingUser.socketId).emit('private message error', err)
        } 

    }

    static sendFriendRequest = async(socket, {data}) => {

        try {

            // Find socketId of user thats receiving the friend request
            const receivingUser = await UserModel.read({by: 'id', data: data.to_user})

            // User doesnt have a socket, which means he inst online at the moment
            if (!receivingUser.socketId) return;

            console.log('Transmitting: ', data)
            return socket.to(receivingUser.socketId).emit('friend request', data)

        } catch (error) {

            // Add error logger here
            const err = new CustomError(500, 'Server error', ['Try again later'])

            // Find socketId of user thats sending the message (notify him of error)
            const sendingUser = await UserModel.read({by: 'id', data: data.from_user})
            if (!sendingUser.socketId) return;
            //console.log('testing error: ', sendingUser.socketId)
            return socket.to(sendingUser.socketId).emit('friend request error', err)
        } 

    }

}

module.exports = SocketController