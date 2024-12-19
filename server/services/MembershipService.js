// Models
const MembershipModel = require('../models/MembershipModel')
const GroupModel = require('../models/GroupModel')

// Custom error
const CustomError = require('../utils/CustomError')

// Validate group existence
const validateGroup = async(groupId) => {
    const group = await GroupModel.read({by: 'groupId', data: groupId})
    if (!group) throw new CustomError(404, 'Not found', ['Group with this id not found'])
    return group
}

// Validate role
const validateRole = async(userId, groupId) => {

    const userMemberships = await MembershipModel.read({by: 'userId', all: true, data: userId})

    let relevantMembership = null

    for (let a=0; a<userMemberships.length; a++) {
        if (Number(userMemberships[a].groupId) === Number(groupId)) {
            relevantMembership = userMemberships[a]
        }
    }

    if (!relevantMembership) {
        throw new CustomError(403, 'Frobidden', ['Not allowed to see this'])
    }

    if (relevantMembership.role === 'owner' || relevantMembership.role === 'admin') return true
    return false
}

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
            await validateGroup(groupId)

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

    // Only owner and admins of group can see it
    static async listRequestsOfGroup(groupId, userId) {
        try {

            // Validate that group exists
            await validateGroup(groupId)

            // Validate that userId can actually use this
            const allowed = await validateRole(userId, groupId)

            if (!allowed) {
                throw new CustomError(403, 'Forbidden', ['User doesnt have the necessary role to access this route'])
            }
        
            const memberships = await MembershipModel.read({by: 'groupId', all: true, data: groupId})
            const requests = memberships.filter((membership) => !membership.accepted)
            return requests

        } catch (error) {
            console.log(error)
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }
    }

    static async sendRequestToJoinGroup(groupId, userId) {

        try {

            // Validate that groupId exists
            await validateGroup(groupId)
            
            // Validate that this user isnt already in this group
            const memberships = await MembershipModel.read({by: 'userId', all: true, data: userId})
            
            for (let a=0; a<memberships.length; a++) {
                if (Number(groupId) === Number(memberships[a].groupId)) {
                    throw new CustomError(
                        403, 
                        'Frobidden', 
                        ['User is already in this group or has already sent a request to join this group']
                    )
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

    // Only owner and admins of group accept it
    static async acceptRequestToJoinGroup(userId, requestId) {

        try {

            // Validate that requestId exists
            const membershipRequest = await MembershipModel.read({by: 'membershipId', data: requestId})
            if (!membershipRequest) throw new CustomError(404, 'Not found', ['Request with this id does not exist'])
            
            // Validate that userId can actually use this
            const allowed = await validateRole(userId, membershipRequest.groupId)

            if (!allowed) {
                throw new CustomError(
                    403, 
                    'Forbidden', 
                    ['User doesnt have the necessary role to access this route']
                )
            }

            // Validate that this request isnt already accepted
            if (membershipRequest.accepted) {
                throw new CustomError(400, 'Bad request', ['Membership request with this id is already accepted'])
            }

            // Update membership status
            const updatedMembership = await MembershipModel.update({
                set: 'accepted', 
                data: true, 
                membershipId: requestId
            })

            return updatedMembership
    

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

    // Only owner and admins of group can deny it
    static async denyRequestToJoinGroup(userId, requestId) {

        try {

            // Validate that requestId exists
            const membershipRequest = await MembershipModel.read({by: 'membershipId', data: requestId})
            if (!membershipRequest) throw new CustomError(404, 'Not found', ['Request with this id does not exist'])
            
            // Validate that userId can actually use this
            const allowed = await validateRole(userId, membershipRequest.groupId)

            if (!allowed) {
                throw new CustomError(
                    403, 
                    'Forbidden', 
                    ['User doesnt have the necessary role to access this route']
                )
            }

            // Validate that this request isnt accepted
            if (membershipRequest.accepted) {
                throw new CustomError(400, 'Bad request', ['Membership request with this id is already accepted'])
            }

            // Update membership status
            const deniedMembership = await MembershipModel.update({
                set: 'accepted', 
                data: false, 
                membershipId: requestId
            })

            // Delete from database (current only solution)
            await MembershipModel.delete(requestId)

            return deniedMembership

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

    // Only owner, admin or user himself can revoke it
    static async revokeMembership(userId, membershipId) {

        try {

            // Validate that membershipId exists
            const membership = await MembershipModel.read({by: 'membershipId', data: membershipId})
            if (!membership) throw new CustomError(404, 'Not found', ['Membership with this id does not exist'])
            
            // Validate that userId can actually use this
            const allowed = await validateRole(userId, membership.groupId)

            if (!allowed && Number(membership.userId) !== Number(userId)) {
                throw new CustomError(
                    403, 
                    'Forbidden', 
                    ['User doesnt have the necessary role to access this route']
                )
            }

            // Validate that this membership doesnt belong to owner
            if (membership.role === 'owner') {
                throw new CustomError(403, 'Forbidden', ['Cant revoke owner membership'])
            }

            // Validate that this membership is actually accepted
            if (!membership.accepted) {
                throw new CustomError(400, 'Bad request', ['Membership request with this id isnt even accepted yet'])
            }

            // Update membership status
            const revokedMembership = await MembershipModel.update({
                set: 'accepted', 
                data: false, 
                membershipId: membershipId
            })

            // Delete from database (current only solution)
            await MembershipModel.delete(membershipId)

            return revokedMembership
    
 
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

    // Only owner and admins of group can update it
    static async updateMembershipRole(userId, membershipId, newRole) {

        try {

            // Validate that membershipId exists
            const membership = await MembershipModel.read({by: 'membershipId', data: membershipId})
            if (!membership) throw new CustomError(404, 'Not found', ['Membership with this id does not exist'])
            
            // Validate that userId can actually use this
            const allowed = await validateRole(userId, membership.groupId)

            if (!allowed) {
                throw new CustomError(
                    403, 
                    'Forbidden', 
                    ['User doesnt have the necessary role to access this route']
                )
            }

            // Validate that this membership doesnt belong to owner
            if (membership.role === 'owner') {
                throw new CustomError(403, 'Forbidden', ['Cant update owner membership'])
            }

            // Validate that this membership is actually accepted
            if (!membership.accepted) {
                throw new CustomError(400, 'Bad request', ['Membership request with this id isnt even accepted yet'])
            }


            // Update membership status
            const updatedMembership = await MembershipModel.update({
                set: 'role', 
                data: newRole, 
                membershipId: membershipId
            })
            
            return updatedMembership

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