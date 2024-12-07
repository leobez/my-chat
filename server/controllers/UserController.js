// DB
const db = require('../db/db')

// Password encryption
const bcrypt = require('bcrypt')
const saltRounds = 12

// Session management
const jwt = require('jsonwebtoken')
const { validationResult, matchedData } = require('express-validator')

// Envirment variables
const secret = process.env.SECRET_KEY

/* SYNCRONOUS WRAPPER FOR SQLITE3 FUNCTIONS */
const {insertUser, getUserByEmail, getUserById, getAllUsers} = require('../utils/sqlite3wrappers')
const errorHandle = require('../utils/errorHandling')

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
            return res.status(500).json({message: 'Server error', type: 'custom', details: ['Fail to generate hash and salt for password']})
        }

        // Insert user into database
        try {
            await insertUser(email, username, hash)
        } catch (error) {

            console.log(error)
            // Some of the info sent by user already exists in database
            if (error.includes('UNIQUE constraint failed')) {

                if (error.includes('Users.username')) {
                    return res.status(400).json({message: 'Bad request',  details: ['Username already used']}) 
                }   

                if (error.includes('Users.email')) {
                    return res.status(400).json({message: 'Bad request',  details: ['Email already used']}) 
                }    
            }
            return res.status(500).json({message: 'Server error',  type: 'custom', details: ['Fail to insert user into database']}) 
        }

        // Get user from database, create token session and send it to user
        try {

            const userData = await getUserByEmail(email)

            const token = jwt.sign(userData, secret, {expiresIn: '1h'})

            return res.cookie('jwt', token, {
                httpOnly: true,
                //secure: true,
                sameSite: 'strict',
            }).status(201).json({message: 'User created', data: {id: userData.userId, email: userData.email, username: userData.username}}) 

        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Server error', type: 'custom', details: ['Fail to get userdata from database']})
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
            
            const userData = await getUserByEmail(email)
            
            if (!userData) {
                return res.status(400).json({message: 'Bad request',  details: ['Email not found']})
            }
            
            // Validate password
            const isPasswordCorrect = bcrypt.compareSync(password, userData.password)

            if (!isPasswordCorrect) {
                return res.status(400).json({message: 'Bad request',  details: ['Wrong password']})
            }

            // Generate JWT
            const token = jwt.sign(userData, secret, {expiresIn: '1h'})
                
            return res.cookie('jwt', token, {
                httpOnly: true,
                //secure: true,
                sameSite: 'strict',
            }).status(200).json({message: 'User logged', data:{id: userData.userId, email:userData.email, username:userData.username}})

        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Server error',  details: ['Fail to get data from database']})
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
            const userDecoded = jwt.verify(token, secret);
            
            return res.status(200).json({
                loggedIn: true, 
                message: 'User is logged in',
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

    // Get all users from database
    static getAll = async(req, res) => {
        
        try {
            
            const allUsers = await getAllUsers()
            return  res.status(200).json({message: 'data retrieved', data: allUsers})

        } catch (error) {   
            console.log(error)
            return res.status(500).json({message: 'Error on server', details: ['Error while retrieving data from DB']})
        }

    }

    // Get user by if from database
    static getById = async(req, res) => {
        try {
            
            const {id} = req.params
            if (!id) return res.status(400).json({message: 'Bad request', details: ['Missing id on URL params']})
            
            const user = await getUserById(id)
            if (!user) return res.status(400).json({message: 'Bad request', details: ['Id on params does not exist']})

            return  res.status(200).json({message: 'data retrieved', data: user})

        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Error on server', details: ['Error while retrieving data from DB']})
        }
    }

}

module.exports = UserController