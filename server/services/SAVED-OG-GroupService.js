// Models
const GroupModel = require('../models/GroupModel')
const UserGroupModel = require('../models/UserGroupModel')

//
const CustomError = require('../utils/CustomError')

// Service
class GroupService {

    static async createGroup(groupData, userId) {

        try {

            // User can have at most 2 created groups
            const maxGroups = 2
            const {total:howManyGroupsHasThisUserCreated} = await GroupModel.read({by: 'count_byowner', data: userId})

            if (howManyGroupsHasThisUserCreated >= maxGroups) {
                throw new CustomError(403, 'Forbidden', ['User already has created 2 groups (max)'])
            }

            // Create group
            const createdGroup = await GroupModel.create(groupData, userId)

            // Automatically add owner to group
            await UserGroupModel.create(createdGroup.groupId, userId, true, 'owner')

            return createdGroup

        } catch (error) {

            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }
    }

    static async listCreatedGroups(userId) {

        try {

            const createdGroups = await GroupModel.read({by: 'owner', all: true, data: userId})
            return createdGroups

        } catch (error) {

            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }
    }

    static async listGroupsImPartOf(userId) {
        try {

            const allGroupsImAssociatedWith = await UserGroupModel.read({by: 'userId', all: true, data: userId})
            const groupsImPartOf = allGroupsImAssociatedWith.filter((association) => association.accepted)
            return groupsImPartOf

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

            const allGroupsImAssociatedWith = await UserGroupModel.read({by: 'userId', all: true, data: userId})
            const requestsSent = allGroupsImAssociatedWith.filter((association) => !association.accepted)
            return requestsSent

        } catch (error) {
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }
    }

    static async listRequestsOfThisGroup(userId, groupId) {
        try {

            // Validate that userId is a part of this gruop
            const groupsOfUser = await UserGroupModel.read({by: 'userId', all: true, data: userId})
            const groupAtHand = groupsOfUser.filter((group) => Number(group.groupId) === Number(groupId))
            if (!groupAtHand || groupAtHand.length === 0) throw new CustomError(403, 'Frobidden', ['User is not in this group'])

            console.log(groupAtHand[0])
            console.log(groupAtHand[0].role !== 'owner', groupAtHand[0].role !== 'admin')

            // Validate that user is either owner or admin of group
            if (groupAtHand[0].role === 'owner' || groupAtHand[0].role === 'admin') {

                // List requests of group
                const requestsOfGroup = await UserGroupModel.read({by: 'groupId', all: true, data: groupId})
                const notAcceptedRequests = requestsOfGroup.filter((request) => !request.accepted)
                return notAcceptedRequests
                
            } else {
                throw new CustomError(403, 'Forbidden', ['User is not owner or admin of this group. Forbidden to see this information'])
            }


        } catch (error) {
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }
    }

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
    }
}

module.exports = GroupService