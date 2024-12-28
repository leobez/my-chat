import { useState } from "react"
import { useDispatch } from "react-redux"
import MessageService from "../../services/MessageService"
import { createHistory } from "../../slices/messageSlice"

export const useGetHistory = () => {

    const [feedback, setFeedback] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const getHistoryWithUser = async(userId:number) => {

        setFeedback([])
        setLoading(true)
        const result = await MessageService.getHistoryWithUser(userId)
        setLoading(false)

        if (!result.success && result.details) return setFeedback(result.details)
        
        dispatch(createHistory({userId: userId, history: result.data}))

    }

    return {
        getHistoryWithUser,
        feedback,
        loading,
    }
}