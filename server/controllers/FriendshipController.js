// Service
const FriendshipService = require('../services/FriendshipService')

// Controller
class FriendshipController {

    static getFriends = async(req, res) => {
        try {
            
            const user = req.user

            const friendsList = await FriendshipService.getFriends(user.userId)

            return res.status(200).json({
                message: 'Data retrieved',
                data: friendsList
            })

        } catch (error) {
            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    }

    static listAllFriendships = async(req, res) => {
        try {
            
            const allFriendships = await FriendshipService.listAllFriendships()

            return res.status(200).json({
                message: 'Data retrieved',
                data: allFriendships
            })

        } catch (error) {
            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    }

    static getSentFriendRequests = async(req, res) => {

        try {
            
            const user = req.user
            const sentRequests = await FriendshipService.getSentFriendRequests(user.userId)

            return res.status(200).json({
                message: 'Data retrieved',
                data: sentRequests
            })

        } catch (error) {

            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }

    }

    static getReceivedFriendRequests = async(req, res) => {

        try {
            
            const user = req.user
            const receivedRequests = await FriendshipService.getReceivedFriendRequests(user.userId)

            return res.status(200).json({
                message: 'Data retrieved',
                data: receivedRequests
            })

        } catch (error) {

            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }

    }

    static sendFriendRequest = async(req, res) => {

        try {
            
            const from = req.user.userId
            const {id:to} = req.params

            const friendshipData = {
                from: Number(from),
                to: Number(to)
            }

            const sentFriendRequest = await FriendshipService.sendFriendRequest(friendshipData)

            //console.log(sentFriendRequest)

            return res.status(201).json({
                message: 'Friendship request sent',
                data: sentFriendRequest
            })

        } catch (error) {

            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }

    }

    static acceptFriendRequest = async(req, res) => {

        try {
            
            const user = req.user
            const {id:friendshipId} = req.params

            const friendshipData = {
                userThatsAccepting: user,
                friendshipId: friendshipId
            }

            const acceptedRequest = await FriendshipService.acceptFriendRequest(friendshipData)

            return res.status(201).json({
                message: 'Friendship accepted',
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

    static denyFriendRequest = async(req, res) => {

        try {
            
            const user = req.user
            const {id:friendshipId} = req.params

            const friendshipData = {
                userThatsDenying: user,
                friendshipId: friendshipId
            }

            const deniedFriendship = await FriendshipService.denyFriendRequest(friendshipData)

            return res.status(201).json({
                message: 'Friendship denied',
                data: deniedFriendship
            })

        } catch (error) {
            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
        
    }

    static deleteFriendship = async(req, res) => {

        try {
            
            const user = req.user
            const {id:friendshipId} = req.params

            const deletedfriendship = await FriendshipService.deleteFriendRequest(user.userId, friendshipId)

            return res.status(201).json({
                message: 'Friendship deleted',
                data: deletedfriendship
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

module.exports = FriendshipController