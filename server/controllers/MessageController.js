// DB
const db = require('../db/db')

// Express-validator
const { validationResult, matchedData } = require('express-validator')

// jwt
const jwt = require('jsonwebtoken')

// Envirment variables
const SECRET = process.env.SECRET_KEY

/* SYNCRONOUS WRAPPER FOR SQLITE3 FUNCTIONS */
const {
    createMessage,
    readMessage
} = require('../utils/messageWrapper')

/* SYNCRONOUS WRAPPER FOR SQLITE3 FUNCTIONS */
function insertMessage(from, to, content) {
    
}
function getMessagesBetween(user1, user2) {
    return new Promise((resolve, reject) => {
        return db.all('SELECT * FROM Messages WHERE (from_user = ? AND to_user = ?) OR (from_user = ? AND to_user = ?) ORDER BY timestamp', [user1, user2, user2, user1], (err, rows) => {
            if (err) {
                console.error('failed to retieve data from DB')
                return reject(err.message)
            } 
            return resolve(rows)
        })
    })
}


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

        // Validate if from === userId that is on jwt-cookie
        try {
            const token = req.cookies.jwt
            const  userData = jwt.verify(token, SECRET)

            // User thats sending the message is not the one thats actually on the req.body
            if (Number(userData.userId) !== Number(from)) {
                return res.status(400).json({message: 'Bad request', details: ['User thats sending the message is not the one thats actually on req.body']})
            }

            const result = await insertMessage(from, to, content)
            return res.status(200).json({message: 'Message saved on DB', data: result.data})

        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Server error', details: ['Error while verifying jwt on cookies']})
        }

    }

    static privateHistory = async(req, res) => {

        // Validate data
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(422).json({message: 'Bad request', details: errors})
        }
            
        // Get data
        const {user:userWeTalkedTo} = matchedData(req)
        const {userId:userWeAre} = jwt.verify(req.cookies.jwt, SECRET)
        //console.log('users: ', userWeTalkedTo, userWeAre)

        // Get every message from database that was exchanged between users: userWeTalkedTo and userWeAre
        try {
            const messages = await getMessagesBetween(userWeAre, userWeTalkedTo)
            return res.status(200).json({message: 'Messages retrieved', data: messages})
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Server error', details: ['Error while retrieving messages from DB']})
        }
    }

}

module.exports = MessageController