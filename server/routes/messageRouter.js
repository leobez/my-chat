const express = require('express')
const router = express.Router()

// Session management
const tokenVerifier = require('../middlewares/TokenVerifier')

// Middleware to verify if 'from' on POST req.body is equal to userId found in session token
// Case: A user with userId=1 sends message={from: 2, to: 3, content: 'whatever'}.
// Problem: user that send the message should not be able to send a message that has 'from' field different than his own userId.
// On frontend, userId shoould be automatically filled, but if somehow the user is able to manipulate it, this middleware stops the message.
const userIdVerifier = require('../middlewares/userIdVerifier')

// Controller
const MessageController = require('../controllers/MessageController')

// Express-validator
const { body, query } = require('express-validator')

// ROUTES
router.post(
        '/',
        body('content').exists().withMessage('Invalid message content').isLength({max: 150}).withMessage('Maximum length for message: 150'),
        body('from').exists().isNumeric().withMessage('Invalid from'),
        body('to').exists().isNumeric().withMessage('Invalid to'),
        tokenVerifier,
        userIdVerifier,
        MessageController.sendPrivateMessage
    )

router.get(
        '/with',
        query('user').exists().isNumeric().withMessage('Invalid id'),
        tokenVerifier,
        userIdVerifier,
        MessageController.privateHistory
    )

module.exports = router