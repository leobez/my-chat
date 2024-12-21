// Models
const GroupMessageModel = require('../models/GroupMessageModel')
const GroupModel = require('../models/GroupModel')
const MembershipModel = require('../models/MembershipModel')
const MessageModel = require('../models/MessageModel')
const UserModel = require('../models/UserModel')

const CustomError = require('../utils/CustomError')

// Service
class GroupMessageService {

    static async createGroupMessage(groupMessageData) {

        try {

            // Validate if 'to_group' group actually exists
            const doesGroupExist = await GroupModel.read({by: 'groupId', data: groupMessageData.to_group})
            if (!doesGroupExist) throw new CustomError(400, 'Bad request', ['Group thats receiving the message does not exist'])
            
            // Validate that user is a part of this group
            const membership = await MembershipModel.read({by: 'userId and groupId', data: [groupMessageData.from_user, groupMessageData.to_group]})
            if (!membership) throw new CustomError(403, 'Forbidden', ['You are not a member of this group'])
            
            // Validate that user is accepted in this group
            if (!membership.accepted) throw new CustomError(403, 'Forbidden', ['You are not accepted in this group'])

            // Create group message
            const groupMessage = await GroupMessageModel.create(groupMessageData)

            return groupMessage;

        } catch (error) {
    
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }

    }

    static async getGroupHistory(data) {

        try {

            // Validate that user can see this history
            const membership = await MembershipModel.read({by: 'userId and groupId', data: [data.userId, data.groupId]})
            if (!membership) throw new CustomError(403, 'Forbidden', ['You are not a member of this group'])
                
             // Validate that user is accepted in this group
            if (!membership.accepted) throw new CustomError(403, 'Forbidden', ['You are not accepted in this group'])

            // Get history
            const history = await GroupMessageModel.read({by: 'history', all: true, data: data.groupId})

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

module.exports = GroupMessageService