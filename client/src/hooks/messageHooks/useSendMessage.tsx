import { useContext, useState } from "react"
import { useDispatch } from "react-redux"
import MessageService from "../../services/MessageService"
import { addMessage } from "../../slices/messageSlice"
import SnackbarContext, { SnackbarContextType } from "../../context/SnackbarContext"

export const useSendMessage = () => {

    const [feedback, setFeedback] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()
    const {handleSnackbar} = useContext(SnackbarContext) as SnackbarContextType

    const sendMessageTo = async(userId:number, content:string) => {

        setFeedback([])
        setLoading(true)
        const result = await MessageService.sendMessageTo(userId, content)
        setLoading(false)

        if (!result.success && result.details) {
            return handleSnackbar({open: true, message: result.details[0], severity: 'error'})
        }
        
        dispatch(addMessage(result.data))

    }

    return {
        sendMessageTo,
        feedback,
        loading,
    }
}