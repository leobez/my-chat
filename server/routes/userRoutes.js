const express = require('express')
const router = express.Router()

// Session management
const tokenVerifier = require('../middlewares/TokenVerifier')
const UserController = require('../controllers/UserController')


// ROUTES
// Unprotected routes
router.post('/register', UserController.register)
router.post('/login', UserController.login)

// Protected routes (uses middleware: tokenVerifier)
router.post('/logout', tokenVerifier, UserController.logout)
router.get('/me', tokenVerifier, UserController.me)

// MISSING ROUTES: /all and /byid/:id

module.exports = router