import { useContext, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import FriendshipService from "../../services/FriendshipService"
import { removeFriend, removeSentRequest } from "../../slices/friendshipSlice"
import SnackbarContext, { SnackbarContextType } from "../../context/SnackbarContext"

export const useDeleteFriendship = () => {

    const [feedback, setFeedback] = useState<string[]>([])

    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()
    const {handleSnackbar} = useContext(SnackbarContext) as SnackbarContextType

    const userId = useSelector((state:any) => state.auth.userId)

    const deleteFriendship = async(friendshipId:number) => {
        
        setFeedback([])
        setLoading(true)
        const result = await FriendshipService.deleteFriendship(friendshipId)
        setLoading(false)

        if (!result.success && result.details) {
            return handleSnackbar({open: true, message: result.details[0], severity: 'error'})
        }
        
        // result.data has: from_user and to_user
        // Here we have to determine which one is the friend (the one who isnt the user)
        // Get his id and remove him from friends
        const userIdToRemove:number = result.data.from_user === userId ? result.data.to_user : result.data.from_user

        dispatch(removeFriend(userIdToRemove))
        dispatch(removeSentRequest(result.data.friendshipId)) 

        handleSnackbar({open: true, message: 'Friendship deleted', severity: 'success'})
    }

    return {
        deleteFriendship,
        feedback,
        loading,
    }
}