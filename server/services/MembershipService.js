// Models
const MembershipModel = require('../models/MembershipModel')
const GroupModel = require('../models/GroupModel')

// Custom error
const CustomError = require('../utils/CustomError')

// Service
class MembershipService {

    static async listAcceptedMemberships(userId) {
        try {

            const memberships = await MembershipModel.read({by: 'userId', all: true, data: userId})
            const acceptedMemberships = memberships.filter((membership) => membership.accepted)
            return acceptedMemberships

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

            const memberships = await MembershipModel.read({by: 'userId', all: true, data: userId})
            const requests = memberships.filter((membership) => !membership.accepted)
            return requests

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
            
            // Get accepted memberships in this group
            const memberships = await MembershipModel.read({by: 'groupId', all: true, data: groupId})
            const members = memberships.filter((membership) => membership.accepted)
            return members

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
            const userMemberships = await MembershipModel.read({by: 'userId', all: true, data: userId})

            let relevantMembership = null
            for (let a=0; a<userMemberships.length; a++) {
                if (Number(userMemberships[a].groupId) === Number(groupId)) {
                    relevantMembership = userMemberships[a]
                }
            }

            if (!relevantMembership) {
                throw new CustomError(403, 'Frobidden', ['User is not in this group'])
            }

            // Validate that user is either owner or admin of group
            if (relevantMembership.role === 'owner' || relevantMembership.role === 'admin') {

                const memberships = await MembershipModel.read({by: 'groupId', all: true, data: groupId})
                const requests = memberships.filter((membership) => !membership.accepted)
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

    static async sendRequestToJoinGroup(userId, groupId) {

        try {

            // Validate that groupId exists
            const group = await GroupModel.read({by: 'groupId', all: true, data: groupId})
            if (!group) throw new CustomError(404, 'Not found', ['Group with this groupId does not exist'])
            
            // Validate that this user isnt already in this group
            const userMemberships = await MembershipModel.read({by: 'userId', all: true, userId})

            for (let a=0; a<userMemberships.length; a++) {
                if (groupId === userMemberships[a].groupId) {
                    throw new CustomError(403, 'Frobidden', ['User is already in this group or has already send request to join this group'])
                }
            }

            // Validate that group hasnt reached maximum capacity yet (max: 100) // STILL HAS TO TEST THIS
            const maximumGroupLength = 3
            const groupMemberships = await MembershipModel.read({by: 'groupId', all: true, data: groupId})
            const acceptedGroupMemberships = groupMemberships.filter((membership) => membership.accepted)   

            if (acceptedGroupMemberships.length >= maximumGroupLength) {
                throw new CustomError(403, 'Forbidden', ['Group has already reached maximum size'])
            }         

            // Create membership request in database (must be accepeted by owner of group still)
            const createdRequest = await MembershipModel.create(groupId, userId, false, 'user')
            return createdRequest

        } catch (error) {
            if (error.type === 'model') {
                // Add error logger here
                if (error.error.includes("SQLITE_CONSTRAINT: UNIQUE constraint failed: Membership.lesser_id, Membership.bigger_id")) {
                    throw new CustomError(400, 'Bad request', ['Association between this user and this group already exists'])
                } else {
                    // Add error logger here
                    throw new CustomError(500, 'Server error', ['Try again later'])

                }
            }

            throw error; // Passing errors to controller
        }
    } 

    static async acceptRequestToJoinGroup(userId, requestId) {

        try {

            // Validate that requestId exists
            const membershipRequest = await MembershipModel.read({by: 'membershipId', data: requestId})
            if (!membershipRequest) throw new CustomError(404, 'Not found', ['Request with this id does not exist'])
            
            // Validate that this request isnt already accepted
            if (membershipRequest.accepted) {
                throw new CustomError(400, 'Bad request', ['Membership request with this id is already accepted'])
            }

            // Validate that userId is an owner or admin of groupId
            const groupId = membershipRequest.groupId
            const userMemberships = await MembershipModel.read({by: 'userId', all: true, data: userId})

            let relevantMembership = null
            for (let a=0; a<userMemberships.length; a++) {
                if (Number(userMemberships[a].groupId) === Number(groupId)) {
                    relevantMembership = userMemberships[a]
                }
            }

            if (!relevantMembership) {
                throw new CustomError(403, 'Frobidden', ['User is not in this group'])
            }

            // Validate that user is either owner or admin of group
            if (relevantMembership.role === 'owner' || relevantMembership.role === 'admin') {

                // Update membership status
                const updatedMembership = await MembershipModel.update(requestId, true)
                return updatedMembership
    
            } else {
                throw new CustomError(403, 'Forbidden', ['User is not owner or admin of this group. Forbidden to accept this request'])
            }

        } catch (error) {
            if (error.type === 'model') {
                // Add error logger here
                if (error.error.includes("SQLITE_CONSTRAINT: UNIQUE constraint failed: Membership.lesser_id, Membership.bigger_id")) {
                    throw new CustomError(400, 'Bad request', ['Association between this user and this group already exists'])
                } else {
                    // Add error logger here
                    throw new CustomError(500, 'Server error', ['Try again later'])

                }
            }

            throw error; // Passing errors to controller
        }
    } 

    static async denyRequestToJoinGroup(userId, requestId) {

        try {

            // Validate that requestId exists
            const membershipRequest = await MembershipModel.read({by: 'membershipId', data: requestId})
            if (!membershipRequest) throw new CustomError(404, 'Not found', ['Request with this id does not exist'])
            
            // Validate that this request isnt accepted
            if (membershipRequest.accepted) {
                throw new CustomError(400, 'Bad request', ['Membership request with this id is already accepted'])
            }

            // Validate that userId is an owner or admin of groupId
            const groupId = membershipRequest.groupId
            const userMemberships = await MembershipModel.read({by: 'userId', all: true, data: userId})

            let relevantMembership = null
            for (let a=0; a<userMemberships.length; a++) {
                if (Number(userMemberships[a].groupId) === Number(groupId)) {
                    relevantMembership = userMemberships[a]
                }
            }

            if (!relevantMembership) {
                throw new CustomError(403, 'Frobidden', ['User is not in this group'])
            }

            // Validate that user is either owner or admin of group
            if (relevantMembership.role === 'owner' || relevantMembership.role === 'admin') {

                // Update membership status
                const deniedMembership = await MembershipModel.update(requestId, false)

                // Delete from database (current only solution)
                await MembershipModel.delete(requestId)

                return deniedMembership
    
            } else {
                throw new CustomError(403, 'Forbidden', ['User is not owner or admin of this group. Forbidden to deny this request'])
            }

        } catch (error) {
            if (error.type === 'model') {
                // Add error logger here
                if (error.error.includes("SQLITE_CONSTRAINT: UNIQUE constraint failed: Membership.lesser_id, Membership.bigger_id")) {
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

module.exports = MembershipService