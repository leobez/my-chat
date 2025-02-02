import { useContext, useState } from "react"
import { useDispatch } from "react-redux"
import FriendshipService from "../../services/FriendshipService"
import { addFriend, removeReceivedRequest } from "../../slices/friendshipSlice"
import { useGetUserById } from "../userHooks/useGetUserById"
import SnackbarContext, { SnackbarContextType } from "../../context/SnackbarContext"

export const useAcceptFriendRequest = () => {

    const [feedback, setFeedback] = useState<string[]>([])
    /* useEffect(() => {console.log(feedback)}, [feedback]) */

    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const {getUserById} = useGetUserById()

    const {handleSnackbar} = useContext(SnackbarContext) as SnackbarContextType

    const acceptFriendRequest = async(friendshipId:number) => {
        
        setFeedback([])
        setLoading(true)
        const result = await FriendshipService.acceptRequest(friendshipId)
        setLoading(false)

        if (!result.success && result.details) {
            return handleSnackbar({open: true, message: result.details[0], severity: 'error'})
        }
        
        // Get user of person we just accepted the request
        const user = await getUserById(result.data.from_user)

        // Add that person to redux and remove the request
        dispatch(addFriend({
            userId: user.userId,
            username: user.username,
            online: user.online,
            friendshipId: result.data.friendshipId
        }))
        dispatch(removeReceivedRequest(result.data.friendshipId))

        handleSnackbar({open: true, message: 'Added new friend', severity: 'success'})

    }

    return {
        acceptFriendRequest,
        feedback,
        loading,
    }
}