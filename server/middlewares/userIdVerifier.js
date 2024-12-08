// jwt
const jwt = require('jsonwebtoken')

// Envirment variables
const SECRET = process.env.SECRET_KEY

const userIdVerifier = (req, res, next) => {

    try {
        
        const token = req.cookies.jwt 
        const  userData = jwt.verify(token, SECRET)

        if (Number(userData.userId) !== Number(req.body.from)) {
            return res.status(400).json({message: 'Bad request', details: ['Divergent userId on session token and req.body']})
        }

        next()

    } catch (error) {
        return res.status(400).json({message: 'Bad request', details: ['Error while validating userId']})
    }
}

module.exports = userIdVerifier