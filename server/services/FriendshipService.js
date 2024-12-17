// Models
const FriendshipModel = require('../models/FriendshipModel')
const MessageModel = require('../models/MessageModel')
const UserModel = require('../models/UserModel')

const CustomError = require('../utils/CustomError')

// Service
class FriendshipService {

    static async getFriends(userId) {

        try {

            const friedsList = await FriendshipModel.read({by: 'userId', all: true, data: userId})

            return friedsList

        } catch (error) {

            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }

    }

    static async getSentFriendRequests(userId) {

        try {

            const sentRequests = await FriendshipModel.read({by: 'sent', all:true, data: userId})
            return sentRequests

        } catch (error) {

            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }

    }

    static async getReceivedFriendRequests(userId) {

        try {

            const receivedRequests = await FriendshipModel.read({by: 'received', all:true, data: userId})
            return receivedRequests

        } catch (error) {

            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }

    }

    static async sendFriendRequest(friendshipData) {

        try {

            // User cant add himself
            if (friendshipData.from === friendshipData.to) throw new CustomError(400, 'Bad request', ['User cant send a friend request to himself'])
            
            // Validate that 'to' user actually exists
            const doesUserExist = await UserModel.read({by: 'id', data: friendshipData.to})
            if (!doesUserExist) throw new CustomError(400, 'Bad request', ['User thats receiving the request does not exist'])

            const createdRequest = await FriendshipModel.create(friendshipData)
            return createdRequest

        } catch (error) {

            if (error.type === 'model') {
                // Add error logger here
                if (error.error.includes("SQLITE_CONSTRAINT: UNIQUE constraint failed: Friendship.lesser_id, Friendship.bigger_id")) {
                    throw new CustomError(400, 'Bad request', ['Friendship between these users already exists'])
                } else {
                    // Add error logger here
                    throw new CustomError(500, 'Server error', ['Try again later'])

                }
            }

            throw error; // Passing errors to controller
        }

    }

    static async acceptFriendRequest(friendshipData) {

        try {

            // Validate that friendship with friendshipId === friendshipData.friendshipId has to_user === friendshipData.user.userId
            // Validate that the user thats accepting this request was actually meant to do so
            const friendship = await FriendshipModel.read({by: 'id', data: friendshipData.friendshipId})

            if (!friendship) throw new CustomError(400, 'Bad request', ['Friendship request with this id does not exist'])

            if (Number(friendshipData.userThatsAccepting.userId) !== Number(friendship.to_user)) throw new CustomError(403, 'Forbidden', ['This friend request was not sent to you'])

            const acceptedRequest = await FriendshipModel.update({accepted: true, friendshipId: friendshipData.friendshipId})
            return acceptedRequest

        } catch (error) {

            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }

    }

    static async denyFriendRequest(friendshipData) {

        try {

            // Validate that friendship with friendshipId === friendshipData.friendshipId has to_user === friendshipData.user.userId
            // Validate that the user thats denying this request was actually meant to do so
            const friendship = await FriendshipModel.read({by: 'id', data: friendshipData.friendshipId})

            if (!friendship) throw new CustomError(400, 'Bad request', ['Friendship request with this id does not exist'])
            
            if (Number(friendshipData.userThatsDenying.userId) !== Number(friendship.to_user)) throw new CustomError(403, 'Forbidden', ['This friend request was not sent to you'])
            
            // Doesnt need to be updated because it will be deleted anyways. Leaving it here just in case the solution
            // changes tho. 
            //const deniedRequest = await FriendshipModel.update({accepted: false, friendshipId: friendshipData.friendshipId})

            // Delete friendship from database. Not ideal solution, but chosen because there is no other way
            // for user to send request to this person again due to UNIQUE constrainsts on database.
            // AKA: I fucked up while creating the database. it is what it is
            await FriendshipModel.delete(friendshipData.friendshipId)

            return true

        } catch (error) {

            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }

    }
 
}

module.exports = FriendshipService