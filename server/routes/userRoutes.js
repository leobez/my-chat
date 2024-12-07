const express = require('express')
const router = express.Router()

// Session management
const tokenVerifier = require('../middlewares/TokenVerifier')

// Controller
const UserController = require('../controllers/UserController')

// Express-validator
const { body } = require('express-validator')


// ROUTES
// Unprotected routes
router.post(
        '/register',
        body('email').exists().isEmail().withMessage('INVALID EMAIL'),
        body('username').exists().withMessage('INVALID USERNAME'),
        body('password').exists().withMessage('INVALID PASSWORD').isLength({min: 3}).withMessage('MINIMUM PASSWORD LENGTH: 3'),
        UserController.register
    )

router.post(
        '/login', 
        body('email').exists().isEmail().withMessage('INVALID EMAIL'),
        body('password').exists().withMessage('INVALID PASSWORD'),
        UserController.login
    )


// Protected routes (uses middleware: tokenVerifier)
router.post('/logout', tokenVerifier, UserController.logout)
router.get('/me', tokenVerifier, UserController.me)
router.get('/all', tokenVerifier, UserController.getAll)
router.get('/byid/:id', tokenVerifier, UserController.getById)

module.exports = router