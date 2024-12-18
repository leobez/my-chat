// Service
const GroupService = require('../services/GroupService')

// Controller
class GroupController {

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

    static async listCreatedGroups (req, res) {

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

    static async listGroupsImPartOf (req, res) {

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

    static async listGroupsISentRequestTo (req, res) {

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

    static async listRequestsOfThisGroup (req, res) {

        try {
            
            const user = req.user
            const {id:groupId} = req.params

            const requestsToJoinGroup = await GroupService.listRequestsOfThisGroup(user.userId, groupId)

            return res.status(201).json({
                message: 'Data retrieved',
                data: requestsToJoinGroup
            }) 

        } catch (error) {
            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    }

    static async sendRequestToJoinGroup (req, res) {

        try {
            
            const user = req.user
            const {id:groupId} = req.params

            const requestCreated = await GroupService.sendRequestToJoinGroup(user.userId, groupId)

            return res.status(201).json({
                message: 'Request sent',
                data: requestCreated
            }) 

        } catch (error) {
            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    }

    // Still do these
    static async acceptRequestToJoinGroup (req, res) {

        try {
            
            const user = req.user
            const {id:groupId} = req.params

            const requestCreated = await GroupService.acceptRequestToJoinGroup(user.userId, groupId)

            return res.status(201).json({
                message: 'Request sent',
                data: requestCreated
            }) 

        } catch (error) {
            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    }

    static async denyRequestToJoinGroup (req, res) {

        try {
            
            const user = req.user
            const {id:groupId} = req.params

            const requestCreated = await GroupService.denyRequestToJoinGroup(user.userId, groupId)

            return res.status(201).json({
                message: 'Request sent',
                data: requestCreated
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