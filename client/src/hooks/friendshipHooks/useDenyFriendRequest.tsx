import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import FriendshipService from "../../services/FriendshipService"
import { removeReceivedRequest } from "../../slices/friendshipSlice"

export const useDenyFriendRequest = () => {

    const [feedback, setFeedback] = useState<string[]>([])
    /* useEffect(() => {console.log(feedback)}, [feedback]) */

    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const denyFriendRequest = async(friendshipId:number) => {
        
        setFeedback([])
        setLoading(true)
        const result = await FriendshipService.denyRequest(friendshipId)
        setLoading(false)

        if (!result.success && result.details) return setFeedback(result.details)

        dispatch(removeReceivedRequest(result.data.friendshipId))
    }

    return {
        denyFriendRequest,
        feedback,
        loading,
    }
}