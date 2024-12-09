// Express-validator
const { validationResult, matchedData } = require('express-validator')

const {
    createFriendship,
    updateFriendship,
    readFriendship
} = require('../utils/friendshipWrapper')

const {
    readUser,
} = require('../utils/userWrapper')

/* CONTROLLER */
class FriendshipController {

    static getSentFriendRequests = async(req, res) => {

        // Validate data
        const userData = req.data

        try {

            // Validate if friend thats being added exists
            const result_1 = await readFriendship({by: 'from_user', data: userData.userId})
            if (result_1.success) return res.status(200).json({message: 'Data retrieved', data: result_1.data})
            
        } catch (error) {

            //onsole.log(error)

            if (error.data.includes('SQLITE_CONSTRAINT: UNIQUE constraint failed: Friendship.lesser_id, Friendship.bigger_id')) {
                return res.status(400).json({message: 'Bad request', details: ['Friendship request already exists']})
            }

            return res.status(500).json({message: 'Server error', details: ['Error while inserting on DB']})

        }

    }

    static getReceivedFriendRequests = async(req, res) => {

        // Validate data
        const userData = req.data

        try {

            // Validate if friend thats being added exists
            const result_1 = await readFriendship({by: 'to_user', data: userData.userId})
            if (result_1.success) return res.status(200).json({message: 'Data retrieved', data: result_1.data})

        } catch (error) {

            //onsole.log(error)

            if (error.data.includes('SQLITE_CONSTRAINT: UNIQUE constraint failed: Friendship.lesser_id, Friendship.bigger_id')) {
                return res.status(400).json({message: 'Bad request', details: ['Friendship request already exists']})
            }

            return res.status(500).json({message: 'Server error', details: ['Error while inserting on DB']})

        }

    }

    static sendFriendRequest = async(req, res) => {
        
        // Validate data
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(422).json({message: 'Bad request', details: errors})
        }
         
        // Get data
        const {from, to} = matchedData(req)

        if (Number(from) === Number(to)) {
            return res.status(400).json({message: 'Bad request', details: ['User cant add himself']})
        }

        try {

            // Validate if friend thats being added exists
            const result_1 = await readUser({by: 'userId', data: to})
            if (result_1 && !result_1.data) return res.status(400).json({message: 'Bad request', details: ['Friend request being sent to non-existent user']})
            
            // Create friendship on database
            const result_2 = await createFriendship(from, to)
            if (result_2.success) return res.status(200).json({message: 'Friendship request saved on DB', data: result_2.data})

        } catch (error) {

            //onsole.log(error)

            if (error.data.includes('SQLITE_CONSTRAINT: UNIQUE constraint failed: Friendship.lesser_id, Friendship.bigger_id')) {
                return res.status(400).json({message: 'Bad request', details: ['Friendship request already exists']})
            }

            return res.status(500).json({message: 'Server error', details: ['Error while inserting on DB']})

        }

    }

    static acceptFriendRequest = async(req, res) => {

        // Validate data
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(422).json({message: 'Bad request', details: errors})
        }
            
        // Get data
        const {friendshipId, from} = matchedData(req)

        try {

            // Verify if friendship exists
            const result_1 = await readFriendship({by: 'byid', data: friendshipId})
            if (!result_1.data) return res.status(400).json({message: 'Bad request', details: ['FriendshipId does not exist']})

            // Verify if 'from' is equal to friendships to_user (only them can accept)
            if (Number(result_1.data.to_user) !== Number(from)) return res.status(400).json({message: 'Bad request', details: ['Friendship request was not sent to this user']})

            const result_2 = await updateFriendship(true, friendshipId)
            if (result_2.success) return res.status(200).json({message: 'Friendship status updated', data: result_2.data})

        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Server error', details: ['Error while manipulating DB']})
        }
    }

    static denyFriendRequest = async(req, res) => {

        // Validate data
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(422).json({message: 'Bad request', details: errors})
        }
            
        // Get data
        const {friendshipId, from} = matchedData(req)

        try {

            // Verify if friendship exists
            const result_1 = await readFriendship({by: 'byid', data: friendshipId})
            if (!result_1.data) return res.status(400).json({message: 'Bad request', details: ['FriendshipId does not exist']})

            // Verify if 'from' is equal to friendships to_user (only them can deny)
            if (Number(result_1.data.to_user) !== Number(from)) return res.status(400).json({message: 'Bad request', details: ['Friendship request was not sent to this user']})

            const result_2 = await updateFriendship(false, friendshipId)
            if (result_2.success) return res.status(200).json({message: 'Friendship status updated', data: result_2.data})

        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Server error', details: ['Error while manipulating DB']})
        }
    }
}

module.exports = FriendshipController