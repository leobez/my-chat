// Models
const FriendshipModel = require("../models/FriendshipModel");
const MessageModel = require("../models/MessageModel");
const GroupMessageModel = require("../models/GroupMessageModel");
const UserModel = require("../models/UserModel");
const MembershipModel = require("../models/MembershipModel");

const CustomError = require("../utils/CustomError");

// Services
const FriendshipService = require("./FriendshipService");
const GroupModel = require("../models/GroupModel");


// List admins and owners of a group
// Used in Socketservice
const listOwnerAndAdminsOfGroup = async(groupId) => {
    try {
        const memberships = await MembershipModel.read({by: 'groupId', all: true, data: groupId})
        const validMemberships = memberships.filter((membership) => membership.role==='owner'||membership.role==='admin')
        return validMemberships
    } catch (error) {
        if (error.type === 'model') {
            // Add error logger here
            throw new CustomError(500, 'Server error', ['Try again later'])
        }

        throw error; // Passing errors to controller
    }
}

class SocketService {

    // friends online status
    static async notifyFriendsDisponibility(userId, io, status) {

        try {

            // Get every friend of userId
            const friendsList = await FriendshipService.getFriends(userId)
            if (!friendsList) return;

            // Get every socketId of userId friends
            let socketIdList = []

            for (let friend of friendsList) {
                const friendData = await UserModel.read({by: 'id', data: friend.userId})
                socketIdList.push(friendData.socketId)
            }

            console.log('notifying friends: ', socketIdList)

            socketIdList.forEach(socketId => {
                //console.log('notifying: ', socketId)
                io.to(socketId).emit('friends online status', {
                    userId: userId,
                    online: status
                })
            });
            
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

    // Group message 
    static async sendGroupMessage(socket, groupMessageId, io) {

        try {

            // Validate that groupMessageId exists
            const groupMessage = await GroupMessageModel.read({by: 'id', data: groupMessageId})
            if (!groupMessage) throw new CustomError(404, 'Not found', ['Group Message with this id was not found']);

            // Validate that groupMessageId was sent by (from_user) socket.user.userId
            if (Number(groupMessage.from_user) !== socket.user.userId) {
                throw new CustomError(403, 'Forbidden', ['This message was not sent by you']);
            }

            // Find ws room thats receiving this message
            const groupId = groupMessage.to_group
            const roomName = `${groupId}_user_room`

            // Emit message to room
            io.to(roomName).emit('group message', groupMessage)

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

            /*  
            
                There are two ways this event can flow
                
                1) from_user   ------->    to_user
                2) to_user     ------->    from_user
                
                if friendship has properties (accepted===0, wait===1)
                that means this event is being triggered to transmit a friend request,
                so its going to flow like example 1.

                if friendship has properties (accepted===1, wait===0)
                that means this event is being triggered to transmit an accepted friend request,
                so its going to flow like example 2.

                if friendship has properties (accepted===0, wait===0)
                that means this event is being triggered to transmit a denied friend request,
                so its going to flow like example 2.

            */

            // Find socketId of users
            let USERID_THATS_RECEIVING
            let USERID_THATS_TRANSMITTING

            if (!friendship.accepted && friendship.wait) {
                USERID_THATS_RECEIVING = friendship.to_user
                USERID_THATS_TRANSMITTING = friendship.from_user
            }
            if (friendship.accepted && !friendship.wait) {
                USERID_THATS_RECEIVING = friendship.from_user
                USERID_THATS_TRANSMITTING = friendship.to_user
            }
            if (!friendship.accepted && !friendship.wait) {
                USERID_THATS_RECEIVING = friendship.from_user
                USERID_THATS_TRANSMITTING = friendship.to_user
            }

            let RECEIVING_USER = await UserModel.read({by: 'id', data: USERID_THATS_RECEIVING})
            let TRANSMITTING_USER = await UserModel.read({by: 'id', data: USERID_THATS_TRANSMITTING})

            // User doesnt exist
            if (!RECEIVING_USER || !TRANSMITTING_USER) {
                throw new CustomError(
                    404, 
                    'Not found', 
                    ['User thats receiving or transmitting this request doesnt exist']
                )
            }

            // User thats receiving doesnt have a socket, which means he inst online at the moment
            if (!RECEIVING_USER.socketId) {
                throw new CustomError(
                    404, 
                    'Not found', 
                    ['User thats receiving the request isnt logged at this moment']
                )
            }

            const formattedFriendship = {
                friendshipId: friendship.friendshipId,
                from_user: friendship.from_user,
                to_user: friendship.to_user,
                accepted: friendship.accepted,
                wait: friendship.wait,
                created_at: friendship.created_at,
            }

            return socket.to(RECEIVING_USER.socketId).emit('friendship', formattedFriendship)

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

            // Validate if group exists
            const doesGroupExist = await GroupModel.read({by: 'groupId', data: groupId})
            if (!doesGroupExist) throw new CustomError(404, 'Not Found', ['Group does not exist'])

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

            // Validate if group exists
            const doesGroupExist = await GroupModel.read({by: 'groupId', data: groupId})
            if (!doesGroupExist) throw new CustomError(404, 'Not Found', ['Group does not exist'])

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
            const validMemberships = await listOwnerAndAdminsOfGroup(membership.groupId)
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
            console.log('error: ', error)
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }
            throw error; // Passing errors to controller
        }

    }

}

module.exports = SocketService