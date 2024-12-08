// Express-validator
const { validationResult, matchedData } = require('express-validator')

// jwt
const jwt = require('jsonwebtoken')

// Envirment variables
const SECRET = process.env.SECRET_KEY

/* SYNCRONOUS WRAPPER FOR SQLITE3 FUNCTIONS */
const {
    createMessage,
    readMessagesBetweenUsers
} = require('../utils/messageWrapper')


/* CONTROLLER */
class MessageController {

    static sendPrivateMessage = async(req, res) => {
        
        // Validate data
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(422).json({message: 'Bad request', details: errors})
        }
         
        // Get data
        const {content, from, to} = matchedData(req)

        try {

            const result = await createMessage(from, to, content)
            if (result.success) return res.status(200).json({message: 'Message saved on DB', data: result.data})

        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Server error', details: ['Error while inserting on DB']})
        }

    }

    static getPivateHistory = async(req, res) => {

        // Validate data
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(422).json({message: 'Bad request', details: errors})
        }
            
        // Get data
        const {userId:  me_user} = jwt.verify(req.cookies.jwt, SECRET)
        const {user:    other_user} = matchedData(req)

        // Get every message from database that was exchanged between users: other_user and me_user
        try {
            const result = await readMessagesBetweenUsers({by: 'users', user1: me_user, user2: other_user})
            if (result.success) return res.status(200).json({message: 'Messages retrieved', data: result.data})
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Server error', details: ['Error while retrieving messages from DB']})
        }
    }

}

module.exports = MessageController