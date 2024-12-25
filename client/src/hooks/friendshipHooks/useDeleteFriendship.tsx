import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import FriendshipService from "../../services/FriendshipService"
import { removeFriend, removeSentRequest } from "../../slices/friendshipSlice"

export const useDeleteFriendship = () => {

    const [feedback, setFeedback] = useState<string[]>([])
    /* useEffect(() => {console.log(feedback)}, [feedback]) */

    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const userId = useSelector((state:any) => state.auth.userId)

    const deleteFriendship = async(friendshipId:number) => {
        
        setFeedback([])
        setLoading(true)
        const result = await FriendshipService.deleteFriendship(friendshipId)
        setLoading(false)

        if (!result.success && result.details) return setFeedback(result.details)
        
        // result.data has: from_user and to_user
        // Here we have to determine which one is the friend (the one who isnt the user)
        // Get his id and remove him from friends
        const userIdToRemove:number = result.data.from_user === userId ? result.data.to_user : result.data.from_user

        dispatch(removeFriend(userIdToRemove))
        dispatch(removeSentRequest(result.data))
    }

    return {
        deleteFriendship,
        feedback,
        loading,
    }
}