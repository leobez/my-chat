// Service
const MembershipService = require('../services/MembershipService')

// Controller
class MembershipController {

    static async listAcceptedMemberships (req, res) {

        try {
            
            const user = req.user
            const accptedMemberships = await UserGroupService.listAcceptedMemberships(user.userId)

            return res.status(200).json({
                message: 'Data retrieved',
                data: accptedMemberships
            }) 

        } catch (error) {
            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    }

    static async listMembershipRequests (req, res) {

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

    static async sendRequestToJoinGroup (req, res) {

        try {

            const user = req.user
            const {id:groupId} = req.params

            const createdRequest = await UserGroupService.sendRequestToJoinGroup(user.userId, groupId)

            return res.status(201).json({
                message: 'Request sent',
                data: createdRequest
            }) 

        } catch (error) {
            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    } 

    static async acceptRequestToJoinGroup (req, res) {

        try {
            
            const user = req.user
            const {id:requestId} = req.params

            const acceptedRequest = await UserGroupService.acceptRequestToJoinGroup(user.userId, requestId)

            return res.status(201).json({
                message: 'Request accepted',
                data: acceptedRequest
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

module.exports = MembershipController