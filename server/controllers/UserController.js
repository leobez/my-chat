// Password encryption
const bcrypt = require('bcrypt')
const saltRounds = 12

// Session management
const jwt = require('jsonwebtoken')
const { matchedData } = require('express-validator')

// Envirment variables
const SECRET = process.env.SECRET_KEY

/* SYNCRONOUS WRAPPER FOR SQLITE3 FUNCTIONS */
const {
        createUser,
        readUser
    } = require('../utils/userWrapper')

const errorHandle = require('../utils/errorHandling')

/* 
    TYPES OF ERRORS 
    message:
        Server error
        Bad request
*/

/* CONTROLLER */
class UserController {

    // Saves user on database, creates session token and sends them.
    static register = async(req, res) => {
        
        // Validate data
        const errorObj = errorHandle(req)

        if (errorObj) {
            return res.status(422).json(errorObj)
        }
        
        // Get data
        const {email, username, password} = matchedData(req)

        // Hash password
        let hash = ''
        try {
            const salt = bcrypt.genSaltSync(saltRounds)
            hash = bcrypt.hashSync(password, salt)
        } catch (error) {
            return res.status(500).json({message: 'Server error', details: ['Fail to generate hash and salt for password']})
        }

        // Insert user into database
        try {

            const result = await createUser(email, username, hash)
            //console.log('RESULT: ', result)

            // User was created successfully. Create session token, and send to client.
            const userData = {
                userId: result.data.userId,
                email: result.data.email,
                username: result.data.username,
                password: result.data.password,
            }

            const token = jwt.sign(userData, secret, {expiresIn: '1h'})

            return res.cookie('jwt', token, {
                httpOnly: true,
                //secure: true,
                sameSite: 'strict',
            }).status(201).json({message: 'User created', data: userData}) 

        } catch (error) {

            //console.log('error: ', error)

            if (error.data.includes('UNIQUE constraint failed')) {

                if (error.data.includes('Users.email')) {
                    return res.status(400).json({message: 'Bad request',  details: ['Email already used']}) 
                }   

                if (error.data.includes('Users.username')) {
                    return res.status(400).json({message: 'Bad request',  details: ['Username already used']}) 
                }  

            } else {

                return res.status(500).json({message: 'Server error',  details: ['Failed to insert user into database. Try again later.']}) 

            }
        }
    }

    // Verify if user exists, matches, creates session token, assigns it to cookie and sends them.
    static login = async(req, res) => {

        // Validate data
        const errorObj = errorHandle(req)

        if (errorObj) {
            return res.status(422).json(errorObj)
        }
            
        // Get data
        const {email, password} = matchedData(req)

        // Find data in DB
        try {
            
            const result = await readUser({by: 'email', data: email})
            console.log('RESULT: ', result)

            if (!result.success) {
                return res.status(400).json({message: 'Bad request',  details: ['Email not found']})
            }

            const userData = {
                userId: result.data.userId,
                email: result.data.email,
                username: result.data.username,
                password: result.data.password,
            }

            // Validate password
            const isPasswordCorrect = bcrypt.compareSync(password, userData.password)

            if (!isPasswordCorrect) {
                return res.status(400).json({message: 'Bad request',  details: ['Wrong password']})
            }

            // Generate JWT
            const token = jwt.sign(userData, SECRET, {expiresIn: '1h'})
                
            return res.cookie('jwt', token, {
                httpOnly: true,
                //secure: true,
                sameSite: 'strict',
            }).status(200).json({message: 'User logged', data:{id: userData.userId, email:userData.email, username:userData.username}})

        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Server error',  details: ['Failed to get data from database']})
        }
    }

    // Remove session token from cookies
    static logout = async(req, res) => {

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
    }

    // Get information of a specfic user based on session token present on cookies
    static me = async(req, res) => {

        try {

            const token = req.cookies.jwt
            const userDecoded = jwt.verify(token, SECRET);
            
            return res.status(200).json({
                loggedIn: true, 
                message: 'User is valid',
                details: ['Valid JWT detected on cookies'],
                data: {
                    id: userDecoded.userId,
                    email: userDecoded.email,
                    username: userDecoded.username,
                }
            })
            
        } catch (error) {
    
            return res.status(500).json({loggedIn: false, message: 'Error on server', details: ['Error while reading cookies']})
    
        }
    }

    // Get user by id
    static getById = async(req, res) => {
        try {
            
            const {id} = req.params
            if (!id) return res.status(400).json({message: 'Bad request', details: ['Missing id on params']})
            
            const result = await readUser({by: 'userId', data: id})

            if (!result.success) {
                return res.status(400).json({message: 'Bad request',  details: ['Id not found']})
            }

            const userData = {
                userId: result.data.userId,
                email: result.data.email,
                username: result.data.username,
            }

            return  res.status(200).json({message: 'Data retrieved', data:userData})

        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Error on server', details: ['Error while retrieving data from DB']})
        }
    }

}

module.exports = UserController