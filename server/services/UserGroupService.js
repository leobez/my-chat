// Models
const UserGroupModel = require('../models/UserGroupModel')
const GroupModel = require('../models/GroupModel')

// Custom error
const CustomError = require('../utils/CustomError')

// Service
class UserGroupService {

    static async listGroupsImPartOf(userId) {
        try {

            const groupsISentRequestTo = await UserGroupModel.read({by: 'userId', all: true, data: userId})
            const groupsIWasAcceptedIn = groupsISentRequestTo.filter((group) => group.accepted)
            return groupsIWasAcceptedIn

        } catch (error) {
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }
    }

    static async listGroupsISentRequestTo(userId) {
        try {

            const groupsISentRequestTo = await UserGroupModel.read({by: 'userId', all: true, data: userId})
            const groupsImNotAcceptedInYet = groupsISentRequestTo.filter((association) => !association.accepted)
            return groupsImNotAcceptedInYet

        } catch (error) {
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }
    }

    static async listMembersOfGroup(groupId) {
        try {

            // Validate that group exists
            const group = await GroupModel.read({by: 'groupId', data: groupId})
            if (!group) throw new CustomError(404, 'Not found', ['Group with this id not found'])

            const groupRequests = await UserGroupModel.read({by: 'groupId', all: true, data: groupId})
            const acceptedMembers = groupRequests.filter((request) => request.accepted)
            return acceptedMembers

        } catch (error) {
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }
    }

    static async listRequestsOfGroup(groupId, userId) {
        try {

            // Validate that group exists
            const group = await GroupModel.read({by: 'groupId', data: groupId})
            if (!group) throw new CustomError(404, 'Not found', ['Group with this id not found'])

            // Validate that userId is a part of this group
            const userGroups = await UserGroupModel.read({by: 'userId', all: true, data: userId})
            const groupAtHand = userGroups.filter((group) => Number(group.groupId) === Number(groupId))
            if (!groupAtHand || groupAtHand.length === 0) {
                throw new CustomError(403, 'Frobidden', ['User is not in this group'])
            }

            let relevantGroup = groupAtHand[0]

            // Validate that user is either owner or admin of group
            if (relevantGroup.role === 'owner' || relevantGroup.role === 'admin') {

                const groupRequests = await UserGroupModel.read({by: 'groupId', all: true, data: groupId})
                const requests = groupRequests.filter((request) => !request.accepted)
                return requests
    
            } else {
                throw new CustomError(403, 'Forbidden', ['User is not owner or admin of this group. Forbidden to see this information'])
            }
            

        } catch (error) {
            console.log(error)
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }
    }

    
    /*     
    static async sendRequestToJoinGroup(userId, groupId) {

        try {

            // Validate that groupId exists
            const group = await GroupModel.read({by: 'groupId', all: true, data: groupId})
            if (!group) throw new CustomError(404, 'Not found', ['Group with this groupId does not exist'])
            
            // Validate that this user isnt already in this group
            const groupsUserIsIn = await UserGroupModel.read({by: 'userId', all: true, userId})
            for (let a=0; a<groupsUserIsIn.length; a++) {
                if (groupId === groupsUserIsIn[a].groupId) {
                    throw new CustomError(403, 'Frobidden', ['User is already in this group or user has already send request to join this group'])
                }
            }

            // Validate that group hasnt reached maximum capacity yet (max: 100) // STILL HAS TO TEST THIS
            const maximumGroupLength = 3
            const amountOfUsersInGroup = await UserGroupModel.read({by: 'groupId', all: true, data: groupId})
            const acceptedUsersInGroup = amountOfUsersInGroup.filter((association) => association.accepted)   
            if (acceptedUsersInGroup >= maximumGroupLength) {
                throw new CustomError(403, 'Forbidden', ['Group has already reached maximum size'])
            }         

            // Create association between user and group in database (must be accepeted by owner of group still)
            const createdRequest = await UserGroupModel.create(groupId, userId, false, 'user')

            return createdRequest

        } catch (error) {
            console.log(error)
            if (error.type === 'model') {
                // Add error logger here
                if (error.error.includes("SQLITE_CONSTRAINT: UNIQUE constraint failed: Users_groups.lesser_id, Users_groups.bigger_id")) {
                    throw new CustomError(400, 'Bad request', ['Association between this user and this group already exists'])
                } else {
                    // Add error logger here
                    throw new CustomError(500, 'Server error', ['Try again later'])

                }
            }

            throw error; // Passing errors to controller
        }
    } */
}

module.exports = UserGroupService