// Service
const SocketService = require('../services/SocketService')

// Controller
class SocketController {

    static notifyFriendsOnline = async(socket, io) => {
        
        console.log(`notifying friends of ${socket.user.userId} that he is online`)

        try {
            await SocketService.notifyFriendsDisponibility(socket.user.userId, io, true)
            return;
        } catch (error) {
            // Add error logger here
            return socket.emit('error', error)
        }  
    }

    static notifyFriendsOffline = async(socket, io) => {
        try {
            await SocketService.notifyFriendsDisponibility(socket.user.userId, io, false)
            return;
        } catch (error) {
            // Add error logger here
            return socket.emit('error', error)
        }  

    }

    static disconnect = async(socket) => {
        try {
            await SocketService.disconnect(socket.user.userId)
            return;
        } catch (error) {
            // Add error logger here
            return socket.emit('error', error)
        }  

    }

    static sendPrivateMessage = async(socket, {messageId}) => {
        try {
            await SocketService.sendPrivateMessage(socket, messageId)
            return;
        } catch (error) {
            // Add error logger here
            return socket.emit('error', error)
        } 

    }

    static sendFriendRequest = async(socket, {friendshipId}) => {
        try {
            await SocketService.sendFriendRequest(socket, friendshipId)
            return;
        } catch (error) {
            // Add error logger here
            return socket.emit('error', error)
        } 

    }

    static acceptFriendRequest = async(socket, {friendshipId}) => {
        try {
            await SocketService.acceptFriendRequest(socket, friendshipId)
            return;
        } catch (error) {
            // Add error logger here
            return socket.emit('error', error)
        } 

    }

}

module.exports = SocketController