const express = require('express')
const router = express.Router()

// Extracts the result of the validation and determines if there are errors or not
const dataValidator = require('../middlewares/dataValidator')

// Validates if user has token or not
const tokenValidator = require('../middlewares/tokenValidator') 

// Controller
const UserController = require('../controllers/UserController')

// Express-validator
const { body, cookie, param } = require('express-validator')

// UNPROTECTED ROUTES
router.post(
    '/register',
    body('username').exists().withMessage('Missing username').trim().notEmpty().withMessage('Empty username').escape(),
    body('email').exists().withMessage('Missing email').trim().notEmpty().withMessage('Empty email').isEmail().withMessage('Invalid Email').escape(),
    body('password').exists().withMessage('Missing password').trim().notEmpty().withMessage('Empty password').escape(),
    dataValidator, 
    UserController.register
)

router.post(
    '/login',
    body('email').exists().withMessage('Missing email').trim().notEmpty().withMessage('Empty email').escape(),
    body('password').exists().withMessage('Missing password').trim().notEmpty().withMessage('Empty password').escape(),
    dataValidator,
    UserController.login
)


// PROTECTED ROUTES
router.post(
    '/logout',
    cookie('jwt').exists().withMessage('Missing JWT on cookies').trim().notEmpty().withMessage('Empty JWT on cookies').escape(),
    dataValidator,
    tokenValidator,
    UserController.logout
)

router.get(
    '/me',
    cookie('jwt').exists().withMessage('Missing JWT on cookies').trim().notEmpty().withMessage('Empty JWT on cookies').escape(),
    dataValidator,
    tokenValidator,
    UserController.profile
)

router.get(
    '/byid/:id',
    cookie('jwt').exists().withMessage('Missing JWT on cookies').trim().notEmpty().withMessage('Empty JWT on cookies').escape(),
    param('id').exists().withMessage('Missing id').trim().notEmpty().withMessage('Empty id').isNumeric().withMessage('Invalid id'),
    dataValidator,
    tokenValidator,
    UserController.getById
)

module.exports = router