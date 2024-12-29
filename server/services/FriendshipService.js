// Models
const FriendshipModel = require('../models/FriendshipModel')
const UserModel = require('../models/UserModel')

// Socket.io
const {getIO} = require('../socketHandler')

const CustomError = require('../utils/CustomError')

// Service
class FriendshipService {

    static async getFriends(userId) {

        try {

            // Get every friendship of user
            const friendsList = await FriendshipModel.read({by: 'userId', all: true, data: userId})
            if (!friendsList) return []

            // Get the id of each friend
            let friendsId = []
            friendsList.forEach(friend => {
                if (friend.from_user === userId) {
                    friendsId.push(friend.to_user)
                } else {
                    friendsId.push(friend.from_user)
                }
            });

            // Get the user object of each friend
            let friendsfinal = []
            for (let a=0; a<friendsId.length; a++) {
                const friend = await UserModel.read({by: 'id', data: friendsId[a]})
                friendsfinal.push({
                    userId: friend.userId,
                    online: friend.socketId ? true : false,
                    username: friend.username,
                })
            }

            return friendsfinal

        } catch (error) {

            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }

    }

    static async listAllFriendships() {

        try {

            // Get every friend of user
            const allFriendships = await FriendshipModel.read({by: 'all', all: true, data: false})
            return allFriendships

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

            // Get all sent requests
            const sentRequests = await FriendshipModel.read({by: 'sent', all:true, data: userId})
            let onlyNotAcceptedOnes = sentRequests.filter((request) => !request.accepted)
            return onlyNotAcceptedOnes

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
            let onlyNotAcceptedOnes = receivedRequests.filter((request) => !request.accepted)
            return onlyNotAcceptedOnes

        } catch (error) {

            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }

    }

    /* ALL OF THESE ARE INTEGRATED WITH WS */
    static async sendFriendRequest(friendshipData) {

        try {

            // User cant add himself
            if (friendshipData.from === friendshipData.to) throw new CustomError(400, 'Bad request', ['User cant send a friend request to himself'])
            
            // Validate that 'to' user actually exists
            const doesUserExist = await UserModel.read({by: 'id', data: friendshipData.to})
            if (!doesUserExist) throw new CustomError(400, 'Bad request', ['User thats receiving the request does not exist'])
            
            // Create request
            let createdRequest = await FriendshipModel.create(friendshipData)

            // Send via ws
            const io = getIO()

            if  (doesUserExist.socketId) {
                let socketIdToReceive = doesUserExist.socketId
                io.to(socketIdToReceive).emit('friendship', {
                    type: 'sent',
                    data: createdRequest
                })
            }

            return createdRequest

        } catch (error) {
            console.log(error)
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

            // Validate that the user thats accepting this request was actually meant to do so
            let friendship = await FriendshipModel.read({by: 'id', data: friendshipData.friendshipId})

            if (!friendship) throw new CustomError(400, 'Bad request', ['Friendship request with this id does not exist'])

            if (Number(friendshipData.userThatsAccepting.userId) !== Number(friendship.to_user)) throw new CustomError(403, 'Forbidden', ['This friend request was not sent to you'])

            let acceptedRequest = await FriendshipModel.update({accepted: true, friendshipId: friendshipData.friendshipId})

            // Send via ws 
            // In this case, the one who sent the request (from) is going to receive a real time feedback that his request was accepted
            const userToReceive = await UserModel.read({by: 'id', data: friendship.from_user})

            if  (userToReceive.socketId) {
                let socketIdToReceive = userToReceive.socketId
                const io = getIO()
                io.to(socketIdToReceive).emit('friendship', {
                    type: 'accepted',
                    data: acceptedRequest
                })
            }

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
            let friendship = await FriendshipModel.read({by: 'id', data: friendshipData.friendshipId})

            if (!friendship) throw new CustomError(400, 'Bad request', ['Friendship request with this id does not exist'])
            
            if (Number(friendshipData.userThatsDenying.userId) !== Number(friendship.to_user)) throw new CustomError(403, 'Forbidden', ['This friend request was not sent to you'])
            
            // Doesnt need to be updated because it will be deleted anyways. Leaving it here just in case the solution
            // changes tho. 
            //const deniedRequest = await FriendshipModel.update({accepted: false, friendshipId: friendshipData.friendshipId})

            // Delete friendship from database. Not ideal solution, but chosen because there is no other way
            // for user to send request to this person again due to UNIQUE constrainsts on database.
            // AKA: I fucked up while creating the database. it is what it is
            await FriendshipModel.delete(friendshipData.friendshipId)

            // In this case, friendship isnt updated on database, as it is deleted, so 'accepted' and 'wait' properties have to be
            // changed here 
            friendship.accepted = 0
            friendship.wait = 0

            // Send via ws 
            // In this case, the one who sent the request (from) is going to receive a real time feedback that his request was denied
            const userToReceive = await UserModel.read({by: 'id', data: friendship.from_user})
            if  (userToReceive.socketId) {
                let socketIdToReceive = userToReceive.socketId
                const io = getIO()
                io.to(socketIdToReceive).emit('friendship', {
                    type: 'denied',
                    data: friendship
                })
            }

            return friendship

        } catch (error) {

            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }

    }

    // TODO
    static async deleteFriendRequest(userId, friendshipId) {

        try {

            // Validate that friendship exists
            const friendship = await FriendshipModel.read({by: 'id', data: friendshipId})
            if (!friendship) throw new CustomError(400, 'Bad request', ['Friendship  with this id does not exist'])

            // Validate that the user thats deleting this friendship can do so
            if (Number(userId)!==Number(friendship.from_user) && Number(userId)!==Number(friendship.to_user)) {
                throw new CustomError(403, 'Forbidden', ['You do not have the privilege to delete this friendship'])
            }
            
            await FriendshipModel.delete(friendshipId)

            // Send via ws 
            // In this case, the one who receives the deleted request is the one who didnt do it
            // Gonna send it to both just in case anyways
            const userToReceive1 = await UserModel.read({by: 'id', data: friendship.to_user})
            const userToReceive2 = await UserModel.read({by: 'id', data: friendship.from_user})
            let io = getIO()

            if  (userToReceive1.socketId) {
                let socketIdToReceive = userToReceive1.socketId
                io.to(socketIdToReceive).emit('friendship', {
                    type: 'deleted',
                    data: friendship
                })
            }

            if  (userToReceive2.socketId) {
                let socketIdToReceive = userToReceive2.socketId
                io.to(socketIdToReceive).emit('friendship', {
                    type: 'deleted',
                    data: friendship
                })
            }

            return friendship

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