const express = require('express')
const router = express.Router()

// Extracts the result of the validation and determines if there are errors or not
const dataValidator = require('../middlewares/dataValidator')

// Validates if user has token or not
const tokenValidator = require('../middlewares/TokenValidator') 

// Controller
const UserController = require('../controllers/UserController')

// Express-validator
const { body, cookie, param } = require('express-validator')

// UNPROTECTED ROUTES
router.post(
    '/register',

    body('username')
        .trim()
        .escape()
        .exists().withMessage('Missing username')
        .notEmpty().withMessage('Empty username'),

    body('password')
        .trim()
        .escape()
        .exists().withMessage('Missing password')
        .notEmpty().withMessage('Empty password'),

    dataValidator, 
    UserController.register
)

router.post(
    '/login',

    body('username')
        .trim()
        .escape()
        .exists().withMessage('Missing username')
        .notEmpty().withMessage('Empty username'),

    body('password')
        .trim()
        .escape()
        .exists().withMessage('Missing password')
        .notEmpty().withMessage('Empty password'),

    dataValidator,
    UserController.login
)


// PROTECTED ROUTES
router.post(
    '/logout',

    cookie('jwt')
        .trim()
        .exists().withMessage('Missing JWT on cookies')
        .notEmpty().withMessage('Empty JWT on cookies'),

    dataValidator,
    tokenValidator,
    UserController.logout
)

router.get(
    '/me',

    cookie('jwt')
        .trim()
        .exists().withMessage('Missing JWT on cookies')
        .notEmpty().withMessage('Empty JWT on cookies'),

    dataValidator,
    tokenValidator,
    UserController.profile
)

router.get(
    '/byid/:id',

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
    UserController.getById
)

router.get(
    '/all',

    cookie('jwt')
        .trim()
        .exists().withMessage('Missing JWT on cookies')
        .notEmpty().withMessage('Empty JWT on cookies'),
        
    dataValidator,
    tokenValidator,
    UserController.getAllUsers
)

router.put(
    '/update/:id',

    param('id')
        .trim()
        .exists().withMessage('Missing id')
        .notEmpty().withMessage('Empty id')
        .isNumeric().withMessage('Invalid id'),

    cookie('jwt')
        .trim()
        .exists().withMessage('Missing JWT on cookies')
        .notEmpty().withMessage('Empty JWT on cookies'),

    body('username')
        .optional()
        .trim()
        .escape(),

    body('newPassword')
        .optional()
        .trim()
        .escape(),

    dataValidator,
    tokenValidator,
    UserController.updateUser
)

router.delete(
    '/delete/:id',

    param('id')
        .trim()
        .exists().withMessage('Missing id')
        .notEmpty().withMessage('Empty id')
        .isNumeric().withMessage('Invalid id'),

    cookie('jwt')
        .trim()
        .exists().withMessage('Missing JWT on cookies')
        .notEmpty().withMessage('Empty JWT on cookies'),   

    dataValidator,
    tokenValidator,
    UserController.deleteUser
)

module.exports = router