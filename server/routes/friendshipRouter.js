const express = require('express')
const router = express.Router()

// Session management
const tokenVerifier = require('../middlewares/TokenVerifier')

// Controller
const FriendshipController = require('../controllers/FriendshipController')

// Express-validator
const { body } = require('express-validator')

// jwt
const jwt = require('jsonwebtoken')

// Envirment variables
const SECRET = process.env.SECRET_KEY

const userIdVerifier = require('../middlewares/userIdVerifier')

// ROUTES
router.post(
    '/add', 
    body('to').exists().withMessage('INVALID "TO" '),
    body('from').exists().withMessage('INVALID "FROM" '),
    tokenVerifier, 
    userIdVerifier,
    FriendshipController.sendFriendRequest
)

router.post(
    '/request', 
    body('accept').exists().withMessage('INVALID "ACCEPT" '),
    body('from').exists().withMessage('INVALID "FROM" '),
    body('messageId').exists().withMessage('INVALID "MESSAGEID" '),
    tokenVerifier,
    userIdVerifier,
    FriendshipController.acceptOrDenyFriendRequest
)

module.exports = router