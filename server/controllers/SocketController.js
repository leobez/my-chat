// Service
const SocketService = require('../services/SocketService')

// Controller
class SocketController {

    // Online status
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

    // Private message
    static privateMessage = async(socket, {messageId}) => {
        try {
            await SocketService.sendPrivateMessage(socket, messageId)
            return;
        } catch (error) {
            // Add error logger here
            return socket.emit('error', error)
        } 

    }

    // Friendship
    static handleFriendship = async(socket, {friendshipId}) => {
        try {
            await SocketService.friendship(socket, friendshipId)
            return;
        } catch (error) {
            // Add error logger here
            return socket.emit('error', error)
        } 

    }


    // Groups
    static enterAdmRoom = async(socket, {groupId}) => {
        try {
            await SocketService.enterAdmRoom(socket, groupId)
            return;
        } catch (error) {
            // Add error logger here
            return socket.emit('error', error)
        } 

    }

    static enterUserRoom = async(socket, {groupId}) => {
        try {
            await SocketService.enterUserRoom(socket, groupId)
            return;
        } catch (error) {
            // Add error logger here
            return socket.emit('error', error)
        } 

    }

    // Membership
    static handleMembership = async(socket, io, {membershipId}) => {
        try {
            await SocketService.membership(socket, membershipId, io)
            return;
        } catch (error) {
            // Add error logger here
            return socket.emit('error', error)
        } 

    }

}

module.exports = SocketController