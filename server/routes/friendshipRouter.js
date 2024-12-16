const express = require('express')
const router = express.Router()

// Extracts the result of the validation and determines if there are errors or not
const dataValidator = require('../middlewares/dataValidator')

// Validates if user has token or not
const tokenValidator = require('../middlewares/tokenValidator') 

// Controller
const FriendshipController = require('../controllers/FriendshipController')

// Express-validator
const { cookie, param } = require('express-validator')

// ROUTES
router.get(
    '/sent',
    
    cookie('jwt')
        .trim()
        .exists().withMessage('Missing JWT on cookies')
        .notEmpty().withMessage('Empty JWT on cookies'),

    dataValidator,
    tokenValidator,
    FriendshipController.getSentFriendRequests
)

router.get(
    '/received',

    cookie('jwt')
        .trim()
        .exists().withMessage('Missing JWT on cookies')
        .notEmpty().withMessage('Empty JWT on cookies'),

    dataValidator,
    tokenValidator,
    FriendshipController.getReceivedFriendRequests
)

router.post(
    '/send/:id', 

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
    FriendshipController.sendFriendRequest
)

router.put(
    '/accept/:id', 

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
    FriendshipController.acceptFriendRequest
)

router.delete(
    '/deny/:id', 

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
    FriendshipController.denyFriendRequest
)

module.exports = router