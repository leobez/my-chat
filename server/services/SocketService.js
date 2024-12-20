const FriendshipModel = require("../models/FriendshipModel");
const MessageModel = require("../models/MessageModel");
const UserModel = require("../models/UserModel");
const MembershipModel = require("../models/MembershipModel");

const CustomError = require("../utils/CustomError");

const FriendshipService = require("./FriendshipService");
const GroupService = require("./GroupService");
const MembershipService = require("./MembershipService");

class SocketService {

    // friends online status
    static async notifyFriendsDisponibility(userId, io, status) {

        try {

            // Get every friend of userId
            const friendsList = await FriendshipService.getFriends(userId)
            if (!friendsList) return;

            // Get every socketId of userId friends
            const socketIdList = friendsList.map((friend) => friend.socketId)
            console.log('notifying friends: ', socketIdList)

            socketIdList.forEach(socketId => {
                io.to(socketId).emit('friends online status', {
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

    // Private message 
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

    // Friendship
    static async friendship(socket, friendshipId) {

        try {

            // Validate that friendshipId exists
            const friendship = await FriendshipModel.read({by: 'id', data: friendshipId})

            if (!friendship) throw new CustomError(
                404, 
                'Not found', 
                ['Friendship request with this friendshipId was not found']
            );

            // Validate that socket accessing this event is a part of the friendship thats being handled
            if (
                Number(friendship.from_user) !== socket.user.userId &&
                Number(friendship.to_user) !== socket.user.userId
            ) {
                throw new CustomError(
                    403, 
                    'Forbidden', 
                    ['You are not a part of this friendship']
                );
            }

            // Find socketId of user thats receiving the request
            let receivingUser

            if (!friendship.accepted) {
                receivingUser = await UserModel.read({by: 'id', data: friendship.to_user})
            } else {
                receivingUser = await UserModel.read({by: 'id', data: friendship.from_user})
            }

            // User doesnt exist
            if (!receivingUser) {
                throw new CustomError(
                    404, 
                    'Not found', 
                    ['User thats receiving this request doesnt exist']
                )
            }

            // User doesnt have a socket, which means he inst online at the moment
            if (!receivingUser.socketId) {
                throw new CustomError(
                    404, 
                    'Not found', 
                    ['User thats receiving the request isnt logged at this moment']
                )
            }

            return socket.to(receivingUser.socketId).emit('friendship', friendship)

        } catch (error) {
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }

    }

    // Group
    static async enterAdmRoom(socket, groupId) {

        try {

            // Validate that socket.user.userId is a owner or admin of groupId
            const membership = await MembershipModel.read({
                by: 'userId and groupId', 
                data: [socket.user.userId, groupId]
            })

            if (!membership) throw new CustomError(403, 'Forbidden', ['You are not a member of this group'])
            
            if (membership.role !== 'owner' && membership.role !== 'admin') {
                throw new CustomError(403, 'Forbidden', ['You are not an owner or admin of this group'])
            }

            // If is valid
            socket.join(`${groupId}_adm_room`)
            return true

        } catch (error) {
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }
            throw error; // Passing errors to controller
        }

    }

    static async enterUserRoom(socket, groupId) {

        try {

            // Validate that socket.user.userId is a owner or admin of groupId
            const membership = await MembershipModel.read({
                by: 'userId and groupId', 
                data: [socket.user.userId, groupId]
            })

            if (!membership) throw new CustomError(403, 'Forbidden', ['You are not a member of this group'])

            // If is valid
            socket.join(`${groupId}_user_room`)
            return true

        } catch (error) {
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }
            throw error; // Passing errors to controller
        }

    }

    // Membership
    static async membership(socket, membershipId, io) {

        try {

            // Validate that membershipId exists
            const membership = await MembershipModel.read({by: 'membershipId', data: membershipId})

            if (!membership) {
                throw new CustomError(
                    404, 
                    'Not found', 
                    ['Membership request with this id was not found']
                );
            }

            // Validate that socket.user.userId is one of these:
            // User that wants to join group
            // Owner of the group
            // Admin of the group

            const userThatWantsToJoinId = membership.userId
            const validMemberships = await MembershipService.listOwnerAndAdminsOfGroup(membership.groupId)
            const validIds = validMemberships.map((membership) => Number(membership.userId))


            if (
                Number(socket.user.userId) !== (userThatWantsToJoinId) &&
                !validIds.includes(Number(socket.user.userId))
            ) {
                throw new CustomError(
                    403, 
                    'Forbidden', 
                    ['You are not a part of this membership']
                );
            }
            
            // Find out who is going to receive this (user or adm group)
            if (!membership.accepted) {
                // This means membership is being sent by USER to the ADM_ROOM
                const roomName = `${membership.groupId}_adm_room`
                io.to(roomName).emit('membership', membership)

            } else {
                // This means membership is being sent by ADM_ROOM to USER
                const receivingUser = await UserModel.read({by: 'id', data: membership.userId})
                const socketId = receivingUser.socketId
                socket.to(socketId).emit('membership', membership)

            }

        } catch (error) {
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }
            throw error; // Passing errors to controller
        }

    }

    /* static async acceptMembershipRequest(socket, membershipId, io) {

        try {

            // Validate that membershipId exists
            const membership = await MembershipModel.read({by: 'membershipId', data: membershipId})
            if (!membership) throw new CustomError(404, 'Not found', ['Membership request with this id was not found']);

            // Validate that user thats accepting this has the privilege to do so
            const userThatsAccepting = socket.user.userId

            // Has to be an owner or admin of membership.groupId
            const userThatsAcceptingMembership = await MembershipModel.read({
                by: 'userId and groupId', 
                data: [userThatsAccepting, membership.groupId]
            })

            if (!userThatsAcceptingMembership) {
                throw new CustomError(403, 'Forbidden', ['You are not a member of this group'])
            }
            
            if (userThatsAcceptingMembership.role !== 'owner' && userThatsAcceptingMembership.role !== 'admin') {
                throw new CustomError(403, 'Forbidden', ['You are not an owner or admin of this group'])
            }

            // Find socketId of user that sent request to be a part of group
            const userThatSentRequest = await UserModel.read({by: 'id', data: membership.userId})

            if (!userThatSentRequest) {
                throw new CustomError(404, 'Not found', ['User that sent this request does not exist anymore'])
            }

            return socket.to(userThatSentRequest.socketId).emit('accepted membership request', membership)

        } catch (error) {
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }
            throw error; // Passing errors to controller
        } */
    
}

module.exports = SocketService