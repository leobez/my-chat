// Service
const UserGroupService = require('../services/UserGroupService')

// Controller
class UserGroupController {

    static async listGroupsImPartOf (req, res) {

        try {
            
            const user = req.user
            const groupsImPartOf = await UserGroupService.listGroupsImPartOf(user.userId)

            return res.status(200).json({
                message: 'Data retrieved',
                data: groupsImPartOf
            }) 

        } catch (error) {
            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    }

    static async listGroupsRequestSent (req, res) {

        try {
            
            const user = req.user
            const requestsSent = await UserGroupService.listGroupsISentRequestTo(user.userId)

            return res.status(200).json({
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

    static async listMembersOfGroup (req, res) {
        try {
            
            const {id:groupId} = req.params
            const acceptedMembers = await UserGroupService.listMembersOfGroup(groupId)

            return res.status(200).json({
                message: 'Data retrieved',
                data: acceptedMembers
            }) 

        } catch (error) {
            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    }

    static async listRequestsOfGroup (req, res) {
        try {
            
            const user = req.user
            const {id:groupId} = req.params
            const requests = await UserGroupService.listRequestsOfGroup(groupId, user.userId)

            return res.status(200).json({
                message: 'Data retrieved',
                data: requests
            }) 

        } catch (error) {
            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    }


/*     
    

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
    } */

/*     static async acceptRequestToJoinGroup (req, res) {

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
    } */
}

module.exports = UserGroupController