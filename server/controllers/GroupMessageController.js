// Service
const GroupMessageService = require('../services/GroupMessageService')


// Controller
class GroupMessageController {

    static sendGroupMessage = async(req, res) => {
        
        try {
            
            const {content} = req.body
            const {id:to_group} = req.params
            const {userId:from_user} = req.user

            const groupMessageData = {
                content: content,
                from_user: Number(from_user),
                to_group: Number(to_group)
            }

            const message = await GroupMessageService.createGroupMessage(groupMessageData)

            return res.status(201).json({
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

    static getGroupHistory = async(req, res) => {

        try {

            const {userId:userId} = req.user
            const {id:groupId} = req.params

            const data = {
                userId: Number(userId),
                groupId: Number(groupId)
            }

            const history = await GroupMessageService.getGroupHistory(data)

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

module.exports = GroupMessageController