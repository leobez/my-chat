const express = require('express')
const router = express.Router()

//Temporary database
const fs = require('fs')
const path = require('path')
const DB_filePath = path.join(__dirname, '../data/user.json')

// Password encryption
const bcrypt = require('bcrypt')
const saltRounds = 10

// Session management
const jwt = require('jsonwebtoken')
const tokenVerifier = require('../middlewares/TokenVerifier')

// Envirment variables
const secret = process.env.SECRET_KEY


// ROUTES

// Unprotected routes
router.post('/register', (req, res) => {

    // Get data
    const {email, username, password} = req.body

    // Validate data
    if (!email || email.length === 0) {
        return res.status(400).json({message: 'Invalid request', details: ['Field Email is required']})
    }
    if (!username || username.length === 0) {
        return res.status(400).json({message: 'Invalid request', details: ['Field Username is required']})
    }
    if (!password || password.length <= 3) {
        return res.status(400).json({message: 'Invalid request', details: ['Field Password is required']})
    }

    let hash = ''
    try {
        const salt = bcrypt.genSaltSync(saltRounds)
        hash = bcrypt.hashSync(password, salt)
    } catch (error) {
        return res.status(500).json({message: 'Error on server',  details: ['Could not generate hash and salt for password']})
    }

    // save data on a JSON (temporary database)
    fs.readFile(DB_filePath, 'utf8', (err, data) => {

        if (err) {
            return res.status(500).json({message: 'Error on server',  details: ['Could not access temporary DB file']})
        }

        // Parse existing data
        let jsonData = []
        if (data) {
            try {
                jsonData = JSON.parse(data)
            } catch (error) {
                return res.status(500).json({message: 'Error on server',  details: ['Could not parse JSON data from temporary DB file']}) 
            }
        }

        // TODO: VERIFY IF EMAIL ALREADY EXISTS
        for (let a=0; a<jsonData.length; a++) {
            if (jsonData[a].email === email) {
                return res.status(400).json({message: 'Invalid request',  details: ['Email already used']}) 
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
                return res.status(500).json({message: 'Error on server',  details: ['Could not access temporary DB file']})
            }

            // Register succesfull
            // auto login user
            const token = jwt.sign(newData, secret, {expiresIn: '1h'})

            res.cookie('jwt', token, {
                httpOnly: true,
                //secure: true,
                sameSite: 'strict',
            }).status(201).json({message: 'User created', data:{id:userId, email:email, username:username}})

        })

    })

})

router.post('/login', (req, res) => {

    // Get data
    const {email, password} = req.body

    // Validate data
    if (!email || email.length === 0) {
        return res.status(400).json({message: 'Invalid request', details: ['Field "Email" is required']})
    }

    if (!password || password.length <= 3) {
        return res.status(400).json({message: 'Invalid request', details: ['Field "Password" is too short']})
    }


    // Register data on JSON (eventually a database)
    fs.readFile(DB_filePath, 'utf8', (err, data) => {

        if (err) {
            return res.status(500).json({message: 'Error on server',  details: ['Could not access temporary DB file']})
        }

        // Parse existing data
        let jsonData = []
        if (data) {
            try {
                jsonData = JSON.parse(data)
            } catch (error) {
                return res.status(500).json({message: 'Error on server',  details: ['Could not access temporary DB file']}) 
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
                    }).status(200).json({message: 'User logged', data:{email:jsonData[a].email, username:jsonData[a].username}})

                }
            }
        }

        return res.status(404).json({message: 'Resource not found',  details: ['User not found inside temporary DB file']})
    })
})


// Protected routes (uses middleware: tokenVerifier)
router.post('/logout', tokenVerifier, (req, res) => {

    try {

        res.cookie('jwt', '', {
            httpOnly: true,
            //secure: true,
            sameSite: 'strict',
            maxAge: 0,
        }).status(200).json({message: 'User logged out', details: ['JWT cookies got removed', 'Needs [ credentials: include ] on the client side fetching in order to work']})

    } catch (error) {

        return res.status(500).json({message: 'Error on server', details: ['Error on updating JWT cookie']})

    }   
})

router.get('/me', tokenVerifier, (req, res) => {

    try {

        const token = req.cookies.jwt

        if (!token) {
            return res.status(401).json({loggedIn: false, message: 'User is not logged in', details: ['JWT cookie does not exist']})
        }

        const userDecoded = jwt.verify(token, secret);

        if (userDecoded.email && userDecoded.username) {
            return res.status(200).json({
                loggedIn: true, 
                message: 'User is logged in',
                details: ['Valid JWT detected on cookies'],
                data: {
                    email: userDecoded.email,
                    username: userDecoded.username,
                }
            })
        }

        return res.status(400).json({loggedIn: false, message: 'User is not logged in', details: ['JWT cookie does exist but isnt valid']})

    } catch (error) {

        return res.status(500).json({loggedIn: false, message: 'Error on server', details: ['Error while reading cookies']})

    }

})

router.get('/all', tokenVerifier, (req, res) => {
    
    const data = req.data

    if (data.email && data.username) {
            
        fs.readFile(DB_filePath, 'utf8', (err, data) => {

            if (err) {
                return res.status(500).json({message: 'Error on server',  details: ['Could not access temporary DB file']})
            }
        
            // Parse existing data
            let jsonData = []
            if (data) {
                try {
                    jsonData = JSON.parse(data)
                } catch (error) {
                    return res.status(500).json({message: 'Error on server',  details: ['Could not access temporary DB file']}) 
                }
            }

            res.status(200).json({message: 'Data retrieved', data: jsonData})      
        })
    }

})

router.get('/byid/:id', tokenVerifier, (req, res) => {
    
    const id = req.params.id
    console.log('id: ', id)

    fs.readFile(DB_filePath, 'utf8', (err, data) => {

        if (err) {
            return res.status(500).json({message: 'Error on server',  details: ['Could not access temporary DB file']})
        }
    
        if (data) {

            try {

                // Parse existing data
                let jsonData = JSON.parse(data)

                for (let a=0; a<jsonData.length; a++) {
                    if (Number(jsonData[a].id) === Number(id)) {
                        return res.status(200).json({message: 'Data retrieved', data: jsonData[a]})      
                    }
                }

                return res.status(404).json({message: 'Invalid id'})      

            } catch (error) {
                return res.status(500).json({message: 'Error on server',  details: ['Could not access temporary DB file']}) 
            }

        } else {

            return res.status(500).json({message: 'Error on server',  details: ['Somehow there is nothing on DB file']}) 
        }

    })
    
})


module.exports = router