// Password encryption
const bcrypt = require('bcrypt')
const saltRounds = 12

// Session management
const jwt = require('jsonwebtoken')

// Envirment variables
const SECRET = process.env.SECRET_KEY

const UserModel = require('../models/UserModel')
const CustomError = require('../utils/CustomError')

class UserService {

    static async register(userData) {

        try {

            // Verify if email is already being used
            const isEmailAlreadyUsed = await UserModel.read({by: 'email', data: userData.email})
            if (isEmailAlreadyUsed) throw new CustomError(400, 'Bad request', ['Email already used'])

            // Verify if username is already being used
            const isUsernameAlreadyUsed = await UserModel.read({by: 'username', data: userData.username})
            if (isUsernameAlreadyUsed) throw new CustomError(400, 'Bad request', ['Username already used'])

            // Hash && salt password
            const salt = bcrypt.genSaltSync(saltRounds)
            const hash = bcrypt.hashSync(userData.password, salt)

            const newUserData = {
                username: userData.username,
                email: userData.email,
                password: hash
            }

            const user = await UserModel.create(newUserData)

            // Generate session token
            const token = jwt.sign(user, SECRET, {expiresIn: '1h'})

            return {
                user: user,
                token: token
            };

        } catch (error) {
    
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }

    }

    static async login(userData) {

        try {

            // Verify if email exists
            const user = await UserModel.read({by: 'email', data: userData.email})
            if (!user) throw new CustomError(400, 'Bad request', ['Email does not exist'])
            
            // validate password
            const isPasswordCorrect = bcrypt.compareSync(userData.password, user.password)
            if (!isPasswordCorrect) throw new CustomError(400, 'Bad request', ['Wrong password'])

            // Generate session token
            const token = jwt.sign(user, SECRET, {expiresIn: '1h'})
            
            return {
                user: user,
                token: token,
            }

        } catch (error) {
            if (error.type === 'model') {
                // Error logger
                throw new CustomError(500, 'Server error', ['Try again later'])
            }
            throw error; // Passing errors to controller
        }
    }

    static async getUserById(userId) {

        try {

            // Verify if email exists
            const user = await UserModel.read({by: 'id', data: userId})
            if (!user) throw new CustomError(400, 'Bad request', ['userId does not exist'])
            
            return user

        } catch (error) {
            if (error.type === 'model') {
                // Error logger
                throw new CustomError(500, 'Server error', ['Try again later'])
            }
            throw error; // Passing errors to controller
        }
    }

}

module.exports = UserService