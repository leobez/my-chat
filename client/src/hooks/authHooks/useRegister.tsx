import { useState } from "react"
import { useDispatch } from "react-redux"
import { loginUser } from "../../slices/authSlice"
import AuthService, { RegisterData } from "../../services/AuthService"

export const useRegister = () => {

    const [feedback, setFeedback] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const register = async(data:RegisterData) => {
        
        setFeedback([])
        setLoading(true)
        const result = await AuthService.register(data)
        setLoading(false)
        if (!result.success && result.details) return setFeedback(result.details)

        dispatch(loginUser(
            {
                userId: result.data.userId,
                email: result.data.email,
                username: result.data.username
            }
        ))     
    }

    return {
        register,
        feedback,
        loading
    }
}