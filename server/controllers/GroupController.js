// Service
const GroupService = require('../services/GroupService')

// Controller
class GroupController {

    // Create a group
    static async createGroup (req, res) {

        try {
            
            const groupData = req.body
            const user = req.user

            const createdGroup = await GroupService.createGroup(groupData, user.userId)

            return res.status(201).json({
                message: 'Group created',
                data: createdGroup
            }) 

        } catch (error) {
            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }

    }

    // Update a group
    static async updateGroup (req, res) {
        try {
            
            const groupData = req.body
            const user = req.user
            const {id:groupId} = req.params

            const updatedGroup = await GroupService.updateGroup(groupData, groupId, user.userId)

            return res.status(201).json({
                message: 'Group updated',
                data: updatedGroup
            }) 

        } catch (error) {
            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    }

    // Delete a group 
    static async deleteGroup (req, res) {
        try {
            
            const user = req.user
            const {id:groupId} = req.params

            const deletedGroup = await GroupService.deleteGroup(groupId, user.userId)

            return res.status(201).json({
                message: 'Group deleted',
                data: deletedGroup
            }) 

        } catch (error) {
            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    }

    // list all groups
    static async listAllGroups (req, res) {

        try {

            const allGroups = await GroupService.listAllGroups()

            return res.status(201).json({
                message: 'Data retrieved',
                data: allGroups
            }) 

        } catch (error) {
            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    }

    // get group by id
    static async getGroupById (req, res) {

        try {
            
            const {id:groupId} = req.params

            const group = await GroupService.getGroupById(groupId)

            return res.status(201).json({
                message: 'Data retrieved',
                data: group
            }) 

        } catch (error) {
            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    }

    // get all groups i created
    static async listGroupsCreatedByMe (req, res) {

        try {
            
            const user = req.user

            const groupsCreatedByMe = await GroupService.listGroupsCreatedBy(user.userId)

            return res.status(201).json({
                message: 'Data retrieved',
                data: groupsCreatedByMe
            }) 

        } catch (error) {
            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    }

}

module.exports = GroupController