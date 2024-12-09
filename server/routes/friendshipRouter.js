const express = require('express')
const router = express.Router()

// Session management
const tokenVerifier = require('../middlewares/TokenVerifier')

// Controller
const FriendshipController = require('../controllers/FriendshipController')

// Express-validator
const { body } = require('express-validator')

const userIdVerifier = require('../middlewares/userIdVerifier')

// ROUTES
router.get(
    '/sent',
    tokenVerifier,
    FriendshipController.getSentFriendRequests
)

router.get(
    '/received',
    tokenVerifier,
    FriendshipController.getReceivedFriendRequests
)

router.post(
    '/add', 
    body('from').exists().withMessage('INVALID "FROM" '),
    body('to').exists().withMessage('INVALID "TO" '),
    tokenVerifier, 
    userIdVerifier,
    FriendshipController.sendFriendRequest
)

router.post(
    '/accept', 
    body('from').exists().withMessage('INVALID "FROM" '),
    body('friendshipId').exists().withMessage('INVALID "FRIENDSHIPID" '),
    tokenVerifier,
    userIdVerifier,
    FriendshipController.acceptFriendRequest
)

router.post(
    '/deny', 
    body('from').exists().withMessage('INVALID "FROM" '),
    body('friendshipId').exists().withMessage('INVALID "FRIENDSHIPID" '),
    tokenVerifier,
    userIdVerifier,
    FriendshipController.denyFriendRequest
)

module.exports = router