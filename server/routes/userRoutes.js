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
        body('email').exists().isEmail().withMessage('Invalid email'),
        body('username').exists().withMessage('Invalid username'),
        body('password').exists().withMessage('Invalid password').isLength({min: 6}).withMessage('Mininum length for password: 6'),
        UserController.register
    )

router.post(
        '/login', 
        body('email').exists().isEmail().withMessage('Invalid email'),
        body('password').exists().withMessage('Invalid password').isLength({min: 6}).withMessage('Mininum length for password: 6'),
        UserController.login
    )


// Protected routes (uses middleware: tokenVerifier)
router.post('/logout', tokenVerifier, UserController.logout)
router.get('/me', tokenVerifier, UserController.me)
router.get('/all', tokenVerifier, UserController.getAll)
router.get('/byid/:id', tokenVerifier, UserController.getById)

// MISSING ROUTES: /all and /byid/:id

module.exports = router