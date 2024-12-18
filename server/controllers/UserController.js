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
                email: user.email
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
            details: ['Session token got removed from cookies']
        })

    }

    static profile = async(req, res) => {

        const userData = req.user

        const filteredUserData = {
            userId: userData.userId,
            email: userData.email,
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
                email: user.email,
                username: user.username
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

}

module.exports = UserController