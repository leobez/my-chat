// DB
const db = require('../db/db')

// Express-validator
const { validationResult, matchedData } = require('express-validator')

// jwt
const jwt = require('jsonwebtoken')

// Envirment variables
const SECRET = process.env.SECRET_KEY

const {
    createFriendship,
    updateFriendship
} = require('../utils/friendshipWrapper')


/* CONTROLLER */
class FriendshipController {

    static sendFriendRequest = async(req, res) => {
        
        // Validate data
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(422).json({message: 'Bad request', details: errors})
        }
         
        // Get data
        const {from, to} = matchedData(req)

        try {

            const result = await createFriendship(from, to)
            if (result.success) return res.status(200).json({message: 'Friendship request saved on DB', data: result.data})

        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Server error', details: ['Error while inserting on DB']})
        }

    }

    static acceptOrDenyFriendRequest = async(req, res) => {

        // Validate data
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(422).json({message: 'Bad request', details: errors})
        }
            
        // Get data
        const {accept, messageId} = matchedData(req)

        try {

            const result = await updateFriendship(accept, messageId)
            if (result.success) return res.status(200).json({message: 'Friendship status updated', data: result.data})

        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Server error', details: ['Error while updating on DB']})
        }
    }

}

module.exports = FriendshipController