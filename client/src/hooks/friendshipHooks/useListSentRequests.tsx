import { useState } from "react"
import { useDispatch } from "react-redux"
import FriendshipService from "../../services/FriendshipService"
import { setSentRequest } from "../../slices/friendshipSlice"

export const useListSentRequests = () => {

    const [feedback, setFeedback] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const listSentRequests = async() => {
        
        setFeedback([])
        setLoading(true)
        const result = await FriendshipService.listSentRequests()
        setLoading(false)

        if (!result.success && result.details) return setFeedback(result.details)

        dispatch(setSentRequest(result.data))
    }

    return {
        listSentRequests,
        feedback,
        loading,
    }
}