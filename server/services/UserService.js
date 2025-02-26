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

            // Verify if username is already being used
            const isUsernameAlreadyUsed = await UserModel.read({by: 'username', data: userData.username})
            if (isUsernameAlreadyUsed) throw new CustomError(400, 'Bad request', ['Username already used'])

            // Hash && salt password
            const salt = bcrypt.genSaltSync(saltRounds)
            const hash = bcrypt.hashSync(userData.password, salt)

            const newUserData = {
                username: userData.username,
                password: hash
            }

            const user = await UserModel.create(newUserData)

            // Generate session token
            const token = jwt.sign(user, SECRET, {expiresIn: '10h'})

            return {
                user: user,
                token: token
            };

        } catch (error) {

            console.log(error)

            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
            }

            throw error; // Passing errors to controller
        }

    }

    static async login(userData) {

        try {

            // Verify if username exists
            const user = await UserModel.read({by: 'username', data: userData.username})
            if (!user) throw new CustomError(400, 'Bad request', ['Username does not exist'])
            
            // validate password
            const isPasswordCorrect = bcrypt.compareSync(userData.password, user.password)
            if (!isPasswordCorrect) throw new CustomError(400, 'Bad request', ['Wrong password'])

            // Generate session token
            const token = jwt.sign(user, SECRET, {expiresIn: '10h'})
            
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

            // Verify if id exists
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

    static async getAllUsers() {

        try {

            const users = await UserModel.read({by: 'all', all: true})
            console.log('users: ', users)
            return users

        } catch (error) {
            if (error.type === 'model') {
                // Error logger
                throw new CustomError(500, 'Server error', ['Try again later'])
            }
            throw error; // Passing errors to controller
        }
    }
    
    static async updateUser(user, type, newData) {

        try {   

            let updatedUser

            if (type === 'username') {

                updatedUser = await UserModel.update({
                    fieldsToBeUpdated: ['username'],
                    newData: [newData],
                    whereUserId: user.userId
                })
            }

            if (type === 'password') {

                // Hash && salt password
                const salt = bcrypt.genSaltSync(saltRounds)
                const hash = bcrypt.hashSync(newData, salt)

                updatedUser = await UserModel.update({
                    fieldsToBeUpdated: ['password'],
                    newData: [hash],
                    whereUserId: user.userId
                })

            }

            // Generate session token
            const token = jwt.sign(updatedUser, SECRET, {expiresIn: '10h'})

            const userDataToSend = {
                userId: updatedUser.userId,
                username: updatedUser.username,
                created_at: updatedUser.created_at,
                updated_at: updatedUser.updated_at
            }

            console.log('userDataToSend: ', userDataToSend)

            return {
                updatedUser: userDataToSend,
                token: token
            }; 

        } catch (error) {

            console.log(error)

            if (error.type === 'model') {

                // Error logger
                if (error.error.includes("UNIQUE constraint failed: Users.username")) {
                    throw new CustomError(400, 'Bad request', ['Username already used'])

                } else {
                    // Add error logger here
                    throw new CustomError(500, 'Server error', ['Try again later'])
                }
            }
            throw error; // Passing errors to controller
        }
    }

    static async deleteUser(user, userToBeDeleted) {

        try {   

            // Validate that this user can actually make this changes
            if (Number(userToBeDeleted) !== Number(user.userId)) {
                throw new CustomError(403, 'Forbidden', 
                    [
                        'Not allowed to delete this user', 
                        'User can only delete himself'
                    ]
                )
            }

            await UserModel.delete(userToBeDeleted)

            return true

        } catch (error) {
            if (error.type === 'model') {
                // Add error logger here
                throw new CustomError(500, 'Server error', ['Try again later'])
                
            }
            throw error; // Passing errors to controller
        }
    }
}

module.exports = UserService