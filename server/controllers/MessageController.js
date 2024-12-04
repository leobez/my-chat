// DB
const db = require('../db/db')

// Express-validator
const { validationResult, matchedData } = require('express-validator')

// jwt
const jwt = require('jsonwebtoken')

// Envirment variables
const secret = process.env.SECRET_KEY


/* SYNCRONOUS WRAPPER FOR SQLITE3 FUNCTIONS */
function insertMessage(from, to, content) {
    return new Promise((resolve, reject) => {
        return db.run('INSERT INTO Messages (from_user, to_user, content) VALUES (?, ?, ?)', [from, to, content], (err) => {
            if (err) {
                console.error('DB Insertion failed')
                return reject(err.message)
            } 
            return resolve('Message saved on DB')
        })
    })
}

/* CONTROLLER */
class MessageController {

    // Saves user on database, creates session token and sends them.
    static privateMessage = async(req, res) => {
        
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
            const  userData = jwt.verify(token, secret)

            // User thats sending the message is not the one thats actually on the req.body
            if (Number(userData.userId) !== Number(from)) {
                return res.status(400).json({message: 'Bad request', details: ['User thats sending the message is not the one thats actually on req.body']})
            }

            await insertMessage(from, to, content)

            return res.status(200).json({message: 'Message saved on DB', data: {from: from, to: to, content: content}})

        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Server error', details: ['Error while veryfing jwt on cookies']})
        }

    }

}

module.exports = MessageController