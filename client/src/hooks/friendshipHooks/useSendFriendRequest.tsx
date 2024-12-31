import { useContext, useState } from "react"
import { useDispatch } from "react-redux"
import FriendshipService from "../../services/FriendshipService"
import { addSentRequest } from "../../slices/friendshipSlice"
import SnackbarContext, { SnackbarContextType } from "../../context/SnackbarContext"

export const useSendFriendRequest = () => {

    const [feedback, setFeedback] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const {handleSnackbar} = useContext(SnackbarContext) as SnackbarContextType

    const sendFriendRequest = async(userId:number) => {
        
        setFeedback([])
        setLoading(true)
        const result = await FriendshipService.sendRequest(userId)
        setLoading(false)

        if (!result.success && result.details) {
            return handleSnackbar({open: true, message: result.details[0], severity: 'error'})
        }

        dispatch(addSentRequest(result.data))

        handleSnackbar({open: true, message: 'Friend request sent', severity: 'success'})

    }

    return {
        sendFriendRequest,
        feedback,
        loading,
    }
}