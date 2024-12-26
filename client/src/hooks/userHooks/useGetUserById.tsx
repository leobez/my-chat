import { useState } from "react"
import UserService from "../../services/UserService"

export const useGetUserById = () => {

    const [feedback, setFeedback] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const getUserById = async(userId:number) => {
        
        setFeedback([])
        setLoading(true)
        const result = await UserService.getUserById(userId)
        setLoading(false)

        if (!result.success && result.details) return setFeedback(result.details)

        return result.data
    }

    return {
        getUserById,
        feedback,
        loading,
    }
}