// Service
const GroupService = require('../services/GroupService')

// Controller
class GroupController {

    // Create a group // TODO
    static async createGroup (req, res) {

        try {
            
            const groupData = req.body
            const user = req.user

            const createdGroup = await GroupService.createGroup(groupData, user.userId)

            // Automatically insert user into group (UserGroupModel)
            // ...

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

    }

    // Delete a group 
    static async deleteGroup (req, res) {

    }

    // list all groups
    static async listAllGroups (req, res) {

        try {
            
            const user = req.user

            const createdGroups = await GroupService.listCreatedGroups(user.userId)

            return res.status(201).json({
                message: 'Data retrieved',
                data: createdGroups
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
            
            const user = req.user

            const partOfGroups = await GroupService.listGroupsImPartOf(user.userId)

            return res.status(201).json({
                message: 'Data retrieved',
                data: partOfGroups
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
    static async listGroupsCreatedBy (req, res) {

        try {
            
            const user = req.user

            const requestsSent = await GroupService.listGroupsISentRequestTo(user.userId)

            return res.status(201).json({
                message: 'Data retrieved',
                data: requestsSent
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