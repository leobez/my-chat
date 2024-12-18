// Models
const GroupModel = require('../models/GroupModel')
const UserGroupModel = require('../models/UserGroupModel')

// Custom error
const CustomError = require('../utils/CustomError')

// Service
class GroupService {

    // Create group
    static async createGroup(groupData, userId) {

        try {

            // User can have at most 2 created groups
            const maxGroups = 2
            const {total:userGroupCount} = await GroupModel.read({by: 'count_byowner', data: userId})

            if (userGroupCount >= maxGroups) {
                throw new CustomError(403, 'Forbidden', ['User already has created 2 groups (max)'])
            }

            // Create group
            const createdGroup = await GroupModel.create(groupData, userId)

            // Insert owner into group
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

    // Update group (needs to be owned by userId)
    static async updateGroup(newGroupData, groupId, userId) {

        try {

            // Verify that group exists
            const group = await GroupModel.read({by: 'groupId', data: groupId})
            if (!group) throw new CustomError(404, 'Not found', ['Group with this id not found'])

            // Verify that group is owned by userId
            if (Number(group.owner) !== Number(userId)) {
                throw new CustomError(403, 'Forbidden', ['Users does not have the privilege to update this group'])
            }

            // Update
            const updatedGroup = await GroupModel.update(newGroupData, groupId)

            return updatedGroup

        } catch (error) {

            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }
    }

    // Delete group (needs to be owned by userId) (TODO)
    static async deleteGroup(groupId, userId) {
        try {

            // Verify that group exists
            const group = await GroupModel.read({by: 'groupId', data: groupId})
            if (!group) throw new CustomError(404, 'Not found', ['Group with this id not found'])

            // Verify that group is owned by userId
            if (Number(group.owner) !== Number(userId)) {
                throw new CustomError(403, 'Forbidden', ['Users does not have the privilege to update this group'])
            }

            // Delete
            await GroupModel.delete(groupId)

            return group

        } catch (error) {

            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }
    }

    // List all groups
    static async listAllGroups() {
        try {

            const allGroups = await GroupModel.read({by: 'all', all: true})
            return allGroups

        } catch (error) {
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }
    }

    // Get group by id
    static async getGroupById(groupId) {
        try {

            const group = await GroupModel.read({by: 'groupId', data: groupId})
            if (!group) throw new CustomError(404, 'Not found', ['Group with this id not found'])
            return group
            
        } catch (error) {
            //console.log(error)
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }
    }

    // List groups created by userId
    static async listGroupsCreatedBy(userId) {

        try {

            const groups = await GroupModel.read({by: 'owner', all: true, data: userId})
            return groups;

        } catch (error) {
            //console.log(error)
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }
    }
}

module.exports = GroupService