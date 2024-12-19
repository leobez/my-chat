// Service
const MembershipService = require('../services/MembershipService')

// Controller
class MembershipController {


    static async listAllMemberships (req, res) {

        try {
            
            const allMemberships = await MembershipService.listAllMemberships()

            return res.status(200).json({
                message: 'Data retrieved',
                data: allMemberships
            }) 

        } catch (error) {
            console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    }

    static async listAcceptedMemberships (req, res) {

        try {
            
            const user = req.user
            const accptedMemberships = await MembershipService.listAcceptedMemberships(user.userId)

            return res.status(200).json({
                message: 'Data retrieved',
                data: accptedMemberships
            }) 

        } catch (error) {
            console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    }

    static async listMembershipRequests (req, res) {

        try {
            
            const user = req.user
            const requestsSent = await MembershipService.listGroupsISentRequestTo(user.userId)

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
            const acceptedMembers = await MembershipService.listMembersOfGroup(groupId)

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
            const requests = await MembershipService.listRequestsOfGroup(groupId, user.userId)

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

            const createdRequest = await MembershipService.sendRequestToJoinGroup(groupId, user.userId)

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

            const acceptedRequest = await MembershipService.acceptRequestToJoinGroup(user.userId, requestId)

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

    static async denyRequestToJoinGroup (req, res) {

        try {
            
            const user = req.user
            const {id:requestId} = req.params

            const deniedRequest = await MembershipService.denyRequestToJoinGroup(user.userId, requestId)

            return res.status(201).json({
                message: 'Request denied',
                data: deniedRequest
            }) 

        } catch (error) {
            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    } 

    static async revokeMembership (req, res) {

        try {
            
            const user = req.user
            const {id:membershipId} = req.params

            const revokedMembership = await MembershipService.revokeMembership(user.userId, membershipId)

            return res.status(201).json({
                message: 'Membership revoked. User has been removed from group',
                data: revokedMembership
            }) 

        } catch (error) {
            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    } 

    static async updateRole(req, res) {
        try {
            
            const user = req.user
            const {id:membershipId} = req.params
            const {newRole} = req.body

            const updatedMembership = await MembershipService.updateMembershipRole(user.userId, membershipId, newRole)

            return res.status(201).json({
                message: 'Membership updated',
                data: updatedMembership
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

module.exports = MembershipController