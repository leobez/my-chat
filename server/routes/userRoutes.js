const express = require('express')
const router = express.Router()

//Temporary database
const fs = require('fs')
const path = require('path')

// Password encryption
const bcrypt = require('bcrypt')
const saltRounds = 10

// Session management
const jwt = require('jsonwebtoken')

// Envirment variables
require('dotenv').config()
const secret = process.env.SECRET_KEY

// File for saving data (temporary DB)
const DB_filePath = path.join(__dirname, '../data.json')

// Middlewares
// ...

// Routes
router.post('/register', (req, res) => {

    // Get data
    const {email, username, password} = req.body

    // Validate data
    if (email.length === 0) {
        return res.status(400).json({message: 'email empty', error: true})
    }
    if (username.length === 0) {
        return res.status(400).json({message: 'username empty', error: true})
    }
    if (password.length <= 3) {
        return res.status(400).json({message: 'password to short', error: true})
    }

    let hash = ''
    try {
        const salt = bcrypt.genSaltSync(saltRounds)
        hash = bcrypt.hashSync(password, salt)
    } catch (error) {
        return res.status(500).json({message: 'Error while hashing password', error: true})
    }

    // save data on a JSON (temporary database)
    fs.readFile(DB_filePath, 'utf8', (err, data) => {

        if (err) {
            return res.status(500).json({message: 'cannot access DB file', error: true})
        }

        // Parse existing data
        let jsonData = []
        if (data) {
            try {
                jsonData = JSON.parse(data)
            } catch (error) {
                return res.status(500).json({message: 'cannot interpret json file', error: true}) 
            }
        }

        // TODO: VERIFY IF EMAIL ALREADY EXISTS
        for (let a=0; a<jsonData.length; a++) {
            if (jsonData[a].email === email) {
                return res.status(400).json({message: 'email already used', error: true}) 
            }
        }

        // Generate id to user (+1 from last)
        let lastId = -1
        if (jsonData.length > 0) {
            lastId = jsonData[jsonData.length-1].id
        } 

        const userId = lastId + 1
        
        const newData = {
            id: userId,
            email: email,
            username: username,
            password: hash
        }

        // Add new user to list
        jsonData.push(newData)

        // Write data on file
        fs.writeFile(DB_filePath, JSON.stringify(jsonData, null, 2), 'utf8', writeErr => {

            if (writeErr) {
                return res.status(500).json({message: 'cannot write into json file', error: true})
            }

            // Register succesfull
            // auto login user
            const token = jwt.sign(newData, secret, {expiresIn: '1h'})

            res.cookie('jwt', token, {
                httpOnly: true,
                //secure: true,
                sameSite: 'strict',
            }).status(200).json({message: 'user registered', user:{id:userId, email:email, username:username}})

        })

    })

})

router.post('/login', (req, res) => {

    // Get data
    const {email, password} = req.body

    // Validate data
    if (email.length === 0) {
        return res.status(400).json({message: 'email empty', error: true})
    }

    if (password.length <= 3) {
        return res.status(400).json({message: 'password to short', error: true})
    }


    // Register data on JSON (eventually a database)
    fs.readFile(DB_filePath, 'utf8', (err, data) => {

        if (err) {
            return res.status(500).json({message: 'cannot access DB file', error: true})
        }

        // Parse existing data
        let jsonData = []
        if (data) {
            try {
                jsonData = JSON.parse(data)
            } catch (error) {
                return res.status(500).json({message: 'cannot interpret json file', error: true}) 
            }
        }

        // Veryfing if user exists
        for (let a=0; a<jsonData.length; a++) {
            if (jsonData[a].email === email) {
                const isPasswordCorrect = bcrypt.compareSync(password, jsonData[a].password)
                if (isPasswordCorrect) {

                    // Generate JWT
                    const token = jwt.sign(jsonData[a], secret, {expiresIn: '1h'})
                    
                    return res.cookie('jwt', token, {
                        httpOnly: true,
                        //secure: true,
                        sameSite: 'strict',
                    }).status(200).json({message: 'logged', user: {email:jsonData[a].email, username:jsonData[a].username}})

                }
            }
        }

        return res.status(400).json({message: 'user does not exist', error: true})
    })
})

router.post('/logout', (req, res) => {

    try {

        res.cookie('jwt', '', {
            httpOnly: true,
            //secure: true,
            sameSite: 'strict',
            maxAge: 0,
        }).status(200).json({message: 'logged out'})

    } catch (error) {

        return res.status(400).json({loggedIn: false, message: 'error on logging out'})

    }   
})

router.get('/me', (req, res) => {

    try {

        //console.log(req.cookies)

        const token = req.cookies.jwt

        if (!token) {
            return res.status(401).json({loggedIn: false})
        }

        const userDecoded = jwt.verify(token, secret);

        /* console.log('userDecoded: ', userDecoded) */

        if (userDecoded.email && userDecoded.username) {
            const sendBack = {
                email: userDecoded.email,
                username: userDecoded.username
            }
            return res.status(200).json({loggedIn: true, user: sendBack})
        }

        return res.status(400).json({loggedIn: false, message: 'invalid info on token'})

    } catch (error) {

        return res.status(400).json({loggedIn: false, message: 'error on reading token'})

    }

})

module.exports = router