import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import FriendshipService from "../../services/FriendshipService"
import { addFriend, removeReceivedRequest } from "../../slices/friendshipSlice"

export const useAcceptFriendRequest = () => {

    const [feedback, setFeedback] = useState<string[]>([])
    /* useEffect(() => {console.log(feedback)}, [feedback]) */

    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const acceptFriendRequest = async(friendshipId:number) => {
        
        setFeedback([])
        setLoading(true)
        const result = await FriendshipService.acceptRequest(friendshipId)
        setLoading(false)

        if (!result.success && result.details) return setFeedback(result.details)

        dispatch(addFriend(result.data.user))
        dispatch(removeReceivedRequest(result.data))
    }

    return {
        acceptFriendRequest,
        feedback,
        loading,
    }
}