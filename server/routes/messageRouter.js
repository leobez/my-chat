const express = require('express')
const router = express.Router()

// Extracts the result of the validation and determines if there are errors or not
const dataValidator = require('../middlewares/dataValidator')

// Validates if user has token or not
const tokenValidator = require('../middlewares/tokenValidator') 

// Controller
const MessageController = require('../controllers/MessageController')

// Express-validator
const { body, param, cookie } = require('express-validator')

// ROUTES
router.post(
        '/:id',

        body('content')
            .trim()
            .escape()
            .exists().withMessage('Missing content')
            .notEmpty().withMessage('Empty content')
            .isLength({max: 150}).withMessage('Maximum length for message: 150'),

        cookie('jwt')
            .trim()
            .exists().withMessage('Missing JWT on cookies')
            .notEmpty().withMessage('Empty JWT on cookies'),

        param('id')
            .trim()
            .exists().withMessage('Missing id')
            .notEmpty().withMessage('Empty id')
            .isNumeric().withMessage('Invalid id'),

        dataValidator,
        tokenValidator,
        MessageController.sendPrivateMessage
    )

router.get(
        '/history/:id',

        cookie('jwt')
            .trim()
            .exists().withMessage('Missing JWT on cookies')
            .notEmpty().withMessage('Empty JWT on cookies'),

        param('id')
            .trim()
            .exists().withMessage('Missing id')
            .notEmpty().withMessage('Empty id')
            .isNumeric().withMessage('Invalid id'),

        dataValidator,
        tokenValidator,
        MessageController.getPivateHistory
    )

module.exports = router