import { useState } from "react"
import { useDispatch } from "react-redux"
import FriendshipService from "../../services/FriendshipService"
import { addFriend, removeReceivedRequest } from "../../slices/friendshipSlice"
import { useGetUserById } from "../userHooks/useGetUserById"

export const useAcceptFriendRequest = () => {

    const [feedback, setFeedback] = useState<string[]>([])
    /* useEffect(() => {console.log(feedback)}, [feedback]) */

    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const {getUserById} = useGetUserById()

    const acceptFriendRequest = async(friendshipId:number) => {
        
        setFeedback([])
        setLoading(true)
        const result = await FriendshipService.acceptRequest(friendshipId)
        setLoading(false)

        if (!result.success && result.details) return setFeedback(result.details)
        
        // Get user of person we just accepted the request
        const user = await getUserById(result.data.from_user)

        // Add that person to redux and remove the request
        dispatch(addFriend(user))
        dispatch(removeReceivedRequest(result.data.friendshipId))
    }

    return {
        acceptFriendRequest,
        feedback,
        loading,
    }
}