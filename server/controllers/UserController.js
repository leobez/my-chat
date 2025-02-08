// Service
const UserService = require('../services/UserService')

// Controller
class UserController {

    static register = async(req, res) => {
        
        try {
            
            const userData = req.body
            const {user, token} = await UserService.register(userData)

            const userInfo = {
                userId: user.userId,
                username: user.username  
            }

            return res.cookie('jwt', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            }).status(201).json({
                message: 'User created',
                data: userInfo
            })

        } catch (error) {
            console.log(error)
            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }

    }

    static login = async(req, res) => {

        try {

            const userData = req.body
            
            const {user, token} = await UserService.login(userData)

            const userInfo = {
                userId: user.userId,
                username: user.username
            }

            return res.cookie('jwt', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            }).status(201).json({
                message: 'User logged',
                data: userInfo
            })

        } catch (error) {

            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })

        }

    }

    static logout = async(req, res) => {

        res.cookie('jwt', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 0,
        }).status(200).json({
            message: 'User logged out', 
            data: ['Session token got removed from cookies']
        })

    }

    static profile = async(req, res) => {

        const userData = req.user

        const filteredUserData = {
            userId: userData.userId,
            username: userData.username,
        }

        // Send back to client
        return res.status(200).json({
            message: 'Data retrieved',
            data: filteredUserData
        })

    }

    static getById = async(req, res) => {

        try {

            const {id:userId} = req.params
            
            const user = await UserService.getUserById(userId)

            const userInfo = {
                userId: user.userId,
                username: user.username,
                online: user.socketId ? true : false
            }

            return res.status(200).json({
                message: 'Data retrieved',
                data: userInfo
            })

        } catch (error) {

            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    }

    static getAllUsers = async(req, res) => {

        try {
            
            const user = await UserService.getAllUsers()

            return res.status(200).json({
                message: 'Data retrieved',
                data: user
            })

        } catch (error) {

            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    } 
 
    static updateUser = async(req, res) => {

        try {
            
            const newUserData = req.body
            const user = req.user
            const {id:userToBeUpdated} = req.params

            const {updatedUser, token} = await UserService.updateUser(user, newUserData, userToBeUpdated)
    
            // In case we want to logoff user after account update
            /* return res.status(201).json({
                message: 'User updated',
                data: updatedUser
            }) */

            return res.cookie('jwt', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            }).status(201).json({
                message: 'User updated',
                data: updatedUser
            })

        } catch (error) {

            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    } 

    static deleteUser = async(req, res) => {

        try {
            
            const user = req.user
            const {id:userToBeDeleted} = req.params

            const deletedUser = await UserService.deleteUser(user, userToBeDeleted)

            return res.status(201).json({
                message: 'User deleted',
                data: deletedUser
            })

        } catch (error) {

            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }
    } 
}

module.exports = UserController