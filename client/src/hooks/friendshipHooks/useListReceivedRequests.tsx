import { useState } from "react"
import { useDispatch } from "react-redux"
import FriendshipService from "../../services/FriendshipService"
import { setReceivedRequest } from "../../slices/friendshipSlice"

export const useListReceivedRequests = () => {

    const [feedback, setFeedback] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const listReceivedRequests = async() => {
        
        setFeedback([])
        setLoading(true)
        const result = await FriendshipService.listReceivedRequests()
        setLoading(false)

        if (!result.success && result.details) return setFeedback(result.details)

        dispatch(setReceivedRequest(result.data))
    }

    return {
        listReceivedRequests,
        feedback,
        loading,
    }
}