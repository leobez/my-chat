// Service
const SocketService = require('../services/SocketService')

// Custom error
const CustomError = require("../utils/CustomError");

// Controller
class SocketController {

    static notifyFriendsOnline = async(socket, io) => {
        try {
            await SocketService.notifyFriendsOnline(socket.user.userId, io, true)
            return;
        } catch (error) {
            // Add error logger here
            return socket.emit('error', error)
        }  
    }

    static notifyFriendsOffline = async(socket, io) => {
        try {
            await SocketService.notifyFriendsOnline(socket.user.userId, io, false)
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

    static sendPrivateMessage = async(socket, {data}) => {

        try {
            await SocketService.sendPrivateMessage(socket, data)
            console.log('Transmitting message')
            return;
        } catch (error) {
            // Add error logger here
            return socket.emit('error', error)
        } 

    }

    static sendFriendRequest = async(socket, {data}) => {

        try {
            await SocketService.sendFriendRequest(socket, data)
            console.log('Transmitting friend request')
            return;
        } catch (error) {
            // Add error logger here
            return socket.emit('error', error)
        } 

    }

}

module.exports = SocketController