const express = require('express')
const router = express.Router()

// Session management
const tokenVerifier = require('../middlewares/TokenVerifier')

// Controller
const MessageController = require('../controllers/MessageController')

// Express-validator
const { body, query } = require('express-validator')


// ROUTES
// Protected routes
/* router.post(
        '/',
        body('content').exists().withMessage('Invalid message content').isLength({max: 150}).withMessage('Maximum length for message: 150'),
        body('from').exists().isNumeric().withMessage('Invalid from'),
        body('to').exists().isNumeric().withMessage('Invalid to'),
        tokenVerifier,
        MessageController.privateMessage
    )


router.get(
    '/with',
    query('user').exists().isNumeric().withMessage('Invalid id'),
    tokenVerifier,
    MessageController.privateHistory
)

router.post(
    '/add', 
    body('to').exists().withMessage('INVALID "TO" '),
    body('from').exists().withMessage('INVALID "FROM" '),
    tokenVerifier, 
    UserController.addFriend
) */

module.exports = router