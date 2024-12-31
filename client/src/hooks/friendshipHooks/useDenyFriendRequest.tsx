import { useContext, useState } from "react"
import { useDispatch } from "react-redux"
import FriendshipService from "../../services/FriendshipService"
import { removeReceivedRequest } from "../../slices/friendshipSlice"
import SnackbarContext, { SnackbarContextType } from "../../context/SnackbarContext"

export const useDenyFriendRequest = () => {

    const [feedback, setFeedback] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()
    const {handleSnackbar} = useContext(SnackbarContext) as SnackbarContextType

    const denyFriendRequest = async(friendshipId:number) => {
        
        setFeedback([])
        setLoading(true)
        const result = await FriendshipService.denyRequest(friendshipId)
        setLoading(false)

        if (!result.success && result.details) {
            return handleSnackbar({open: true, message: result.details[0], severity: 'error'})
        }
        

        dispatch(removeReceivedRequest(result.data.friendshipId))

        handleSnackbar({open: true, message: 'Friendship denied', severity: 'success'})
    }

    return {
        denyFriendRequest,
        feedback,
        loading,
    }
}