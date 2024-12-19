const FriendshipModel = require("../models/FriendshipModel");
const MessageModel = require("../models/MessageModel");
const UserModel = require("../models/UserModel");

const CustomError = require("../utils/CustomError");

const FriendshipService = require("./FriendshipService");

class SocketService {

    static async notifyFriendsDisponibility(userId, io, status) {

        try {

            // Get every friend of userId
            const friendsList = await FriendshipService.getFriends(userId)
            if (!friendsList) return;

            // Get every socketId of userId friends
            const socketIdList = friendsList.map((friend) => friend.socketId)

            socketIdList.forEach(socketId => {
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

            await UserModel.update({
                fieldsToBeUpdated: ['socketId'],
                newData: [null],
                whereUserId: userId
            })

            return true
            
        } catch (error) {
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }
            throw error; // Passing errors to controller
        }
    }

    static async sendPrivateMessage(socket, messageId) {

        try {

            // Validate that messageId exists
            const message = await MessageModel.read({by: 'id', data: messageId})
            if (!message) throw new CustomError(404, 'Not found', ['Message with this messageId was not found']);

            // Validate that messageId was sent by (from_user) socket.user.userId
            if (Number(message.from_user) !== socket.user.userId) {
                throw new CustomError(403, 'Forbidden', ['This message was not sent by you']);
            }

            // Find socketId of user thats receiving the message
            const receivingUser = await UserModel.read({by: 'id', data: message.to_user})
            if (!receivingUser) throw new CustomError(404, 'Not found', ['User thats receiving the message doesnt exist']);

            // User doesnt have a socket, which means he inst online at the moment
            if (!receivingUser.socketId) throw new CustomError(404, 'Not found', ['User thats receiving the message isnt logged at this moment']);

            console.log('TRANSMITTING: ', message)
            return socket.to(receivingUser.socketId).emit('private message', message)

        } catch (error) {
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }
            throw error; // Passing errors to controller
        }

    }

    static async sendFriendRequest(socket, friendshipId) {

        try {
            // Validate that friendshipId exists
            const friendship = await FriendshipModel.read({by: 'id', data: friendshipId})
            if (!friendship) throw new CustomError(404, 'Not found', ['Friendship request with this friendshipId was not found']);

            // Validate that friendshipId was sent by (from_user) socket.user.userId
            if (Number(friendship.from_user) !== socket.user.userId) {
                throw new CustomError(403, 'Forbidden', ['This friendship request was not sent by you']);
            }

            // Find socketId of user thats receiving the request
            const receivingUser = await UserModel.read({by: 'id', data: friendship.to_user})

            // User doesnt have a socket, which means he inst online at the moment
            if (!receivingUser) throw new CustomError(404, 'Not found', ['User thats receiving the message doesnt exist']);

            // User doesnt have a socket, which means he inst online at the moment
            if (!receivingUser.socketId) throw new CustomError(404, 'Not found', ['User thats receiving the request isnt logged at this moment']);

            return socket.to(receivingUser.socketId).emit('friend request', friendship)

        } catch (error) {
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }
            throw error; // Passing errors to controller
        }

    }

    static async acceptFriendRequest(socket, friendshipId) {

        try {
            // Validate that friendshipId exists
            const friendship = await FriendshipModel.read({by: 'id', data: friendshipId})
            if (!friendship) throw new CustomError(404, 'Not found', ['Friendship request with this friendshipId was not found']);

            // Validate that friendshipId was sent to (to_user) socket.user.userId
            if (Number(friendship.to_user) !== socket.user.userId) {
                throw new CustomError(403, 'Forbidden', ['This friendship request was not sent to you']);
            }

            // Find socketId of user thats sent the request
            const receivingUser = await UserModel.read({by: 'id', data: friendship.from_user})

            // User doesnt have a socket, which means he inst online at the moment
            if (!receivingUser) throw new CustomError(404, 'Not found', ['User thats receiving the request doesnt exist']);

            // User doesnt have a socket, which means he inst online at the moment
            if (!receivingUser.socketId) throw new CustomError(404, 'Not found', ['User thats receiving the request isnt logged at this moment']);

            return socket.to(receivingUser.socketId).emit('accept friend request', friendship)

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