// Models
const FriendshipModel = require('../models/FriendshipModel')
const MessageModel = require('../models/MessageModel')
const UserModel = require('../models/UserModel')

// Socket.io
const {getIO} = require('../socketHandler')

const CustomError = require('../utils/CustomError')

// Service
class MessageService {

    static async createMessage(messageData) {

        try {

            // Validate if message is being sent from user to same user
            if (messageData.from === messageData.to) throw new CustomError(400, 'Bad request', ['User is trying to send a message to himself'])
            
            // Validate if 'to' user actually exists
            const doesUserExist = await UserModel.read({by: 'id', data: messageData.to})
            if (!doesUserExist) throw new CustomError(400, 'Bad request', ['user thats receiving the message does not exist'])
            
            // Verify if from and to users are friends
            const fromFriendships = await FriendshipModel.read({by: 'userId', all: true, data: messageData.from})
            let found = false
            fromFriendships.forEach((friendship) => {
                if (Number(messageData.to) === friendship.to_user) {
                    found = true
                }
            })
            if (!found) {
                throw new CustomError(403, 'Forbidden', ['Can only send message to friends'])
            }

            const message = await MessageModel.create(messageData)
            
            // Send via ws 
            // In this case, the one who receives the message is the one on to_user field
            const receiverSocketId = doesUserExist.socketId

            if  (receiverSocketId) {
                const io = getIO()
                io.to(receiverSocketId).emit('private message', message)
            }

            return message;

        } catch (error) {
    
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }

    }

    static async getHistory(data) {

        try {

            // Validate if history request is from user to same user
            if (data.user1 === data.user2) throw new CustomError(400, 'Bad request', ['User is trying to view a history with himself (not possible)'])
            
            const history = await MessageModel.read({by: 'history', all: true, data: data})

            return history;

        } catch (error) {
            
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }

    }

}

module.exports = MessageService