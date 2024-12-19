// For session management
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET_KEY

// Model
const UserModel = require('../models/UserModel')

const tokenValidator = async (req, res, next) => {

    try {

        const token = req.cookies.jwt
        const userDecoded = jwt.verify(token, SECRET)

        // Validate that user exists on DB
        const userFromDb = await UserModel.read({by: 'id', data: userDecoded.userId})

        if (!userFromDb) {
            return res.status(401).json({
                message: 'Unauthorized',
                details: ['JWT gets decoded to an non existent user']
            })
        }

        if (
            userFromDb.userId !== userDecoded.userId ||
            userFromDb.email !== userDecoded.email ||
            userFromDb.username !== userDecoded.username ||
            userFromDb.updated_at !== userDecoded.updated_at
        ) { 
            return res.status(401).json({
                message: 'Unauthorized',
                details: ['User decoded from JWT is not the same as the on in the database']
            })
        }
        
        req.user = userDecoded
        next()

    } catch (error) {

        console.log(error)

        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({
                message: 'Forbidden',
                details: ['Token expired']
            })
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Unauthorized',
                details: ['Token invalid']
            })
        }

        // Add error logger here
        //console.error(error)

        return res.status(500).json({
            message: 'Server error',
            details: ['Something went wrong. Try again later']
        })
    }
}

module.exports = tokenValidator