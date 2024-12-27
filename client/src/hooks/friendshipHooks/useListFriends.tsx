import { useState } from "react"
import { useDispatch } from "react-redux"
import FriendshipService from "../../services/FriendshipService"
import { setFriend } from "../../slices/friendshipSlice"

export const useListFriends = () => {

    const [feedback, setFeedback] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const listFriends = async() => {
        
        setFeedback([])
        setLoading(true)
        const result = await FriendshipService.listFriends()
        setLoading(false)

        if (!result.success && result.details) return setFeedback(result.details)
        
        dispatch(setFriend(result.data))
    }

    return {
        listFriends,
        feedback,
        loading,
    }
}