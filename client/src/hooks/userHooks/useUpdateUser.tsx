import { useState } from "react"
import UserService from "../../services/UserService"

export interface UpdateUserData {
    type: 'username' | 'password';
    userId: number
    username?: string;
    newPassword?: string;
}

export const useUpdateUser = () => {

    const [feedback, setFeedback] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const updateUser = async(updateUserData:UpdateUserData) => {
        
        setFeedback([])
        setLoading(true)
        const result = await UserService.updateUser(updateUserData)
        setLoading(false)

        if (!result.success && result.details) return setFeedback(result.details)

        return result.data
    }

    return {
        updateUser,
        feedback,
        loading,
    }
}