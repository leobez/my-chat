const UserModel = require("../models/UserModel");

const CustomError = require("../utils/CustomError");

const FriendshipService = require("./FriendshipService");

class SocketService {

    static async notifyFriendsOnline(userId, io, status) {

        try {

            // Get every friend of userId
            const friendsList = await FriendshipService.getFriends(userId)
            if (!friendsList) return;

            // Get every socketId of userId friends
            const socketIdList = friendsList.map((friend) => friend.socketId)
            
            socketIdList.array.forEach(socketId => {
                io.to(socketId).emit('online status', {
                    user: userId,
                    online: status
                })
            });
            
            return true

        } catch (error) {
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }
            throw error; // Passing errors to controller
        }
    }

    static async disconnect(userId) {

        try {
            await UserModel.update(null, userId)
            return true
        } catch (error) {
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }
            throw error; // Passing errors to controller
        }
    }

    static async sendPrivateMessage(socket, message) {

        try {

            // Find socketId of user thats receiving the message
            const receivingUser = await UserModel.read({by: 'id', data: message.to_user})

            // User doesnt have a socket, which means he inst online at the moment
            if (!receivingUser.socketId) throw new CustomError(404, 'Not found', ['User thats receiving the message isnt logged at this moment']);

            return socket.to(receivingUser.socketId).emit('private message', message)

        } catch (error) {
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }
            throw error; // Passing errors to controller
        }

    }

    static async sendFriendRequest(socket, request) {

        try {

            // Find socketId of user thats receiving the request
            const receivingUser = await UserModel.read({by: 'id', data: request.to_user})

            // User doesnt have a socket, which means he inst online at the moment
            if (!receivingUser.socketId) throw new CustomError(404, 'Not found', ['User thats receiving the request isnt logged at this moment']);

            return socket.to(receivingUser.socketId).emit('friend request', request)

        } catch (error) {
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }
            throw error; // Passing errors to controller
        }

    }
}

module.exports = SocketService