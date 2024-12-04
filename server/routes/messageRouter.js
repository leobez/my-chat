const express = require('express')
const router = express.Router()

// Session management
const tokenVerifier = require('../middlewares/TokenVerifier')

// Controller
const MessageController = require('../controllers/MessageController')

// Express-validator
const { body } = require('express-validator')


// ROUTES
// Unprotected routes
router.post(
        '/',
        body('content').exists().withMessage('Invalid message content').isLength({max: 150}).withMessage('Maximum length for message: 150'),
        body('from').exists().isNumeric().withMessage('Invalid from'),
        body('to').exists().isNumeric().withMessage('Invalid to'),
        tokenVerifier,
        MessageController.privateMessage
    )


module.exports = router