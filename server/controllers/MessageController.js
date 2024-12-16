// Service
const MessageService = require('../services/MessageService')


// Controller
class MessageController {

    static sendPrivateMessage = async(req, res) => {
        
        try {
            
            const {content} = req.body
            const {id:to} = req.params
            const {userId:from} = req.user

            const messageData = {
                content: content,
                from: Number(from),
                to: Number(to)
            }

            const message = await MessageService.createMessage(messageData)

            return res.status(200).json({
                message: 'Message sent', 
                data: message
            })

        } catch (error) {

            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }

    }

    static getPivateHistory = async(req, res) => {

        try {

            const {userId:user1} = req.user
            const {id:user2} = req.params

            const data = {
                user1: Number(user1),
                user2: Number(user2)
            }

            const history = await MessageService.getHistory(data)

            return res.status(200).json({
                message: 'Data retrieved', 
                data: history
            })

        } catch (error) {

            //console.error('CONTROLLER ERROR: ', error)
            return res.status(error.status).json({
                message: error.message,
                details: error.details
            })
        }

    }

}

module.exports = MessageController