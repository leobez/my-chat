import { useState } from "react"
import { useDispatch } from "react-redux"
import MessageService from "../../services/MessageService"
import { addMessage } from "../../slices/messageSlice"

export const useSendMessage = () => {

    const [feedback, setFeedback] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const sendMessageTo = async(userId:number, content:string) => {

        setFeedback([])
        setLoading(true)
        const result = await MessageService.sendMessageTo(userId, content)
        setLoading(false)

        if (!result.success && result.details) return setFeedback(result.details)
        
        dispatch(addMessage(result.data))

    }

    return {
        sendMessageTo,
        feedback,
        loading,
    }
}