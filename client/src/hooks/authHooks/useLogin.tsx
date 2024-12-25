import { useState } from "react"
import { useDispatch } from "react-redux"
import { loginUser } from "../../slices/authSlice"
import AuthService, { LoginData } from "../../services/AuthService"

export const useLogin = () => {

    const [feedback, setFeedback] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const login = async(data:LoginData) => {
        
        setFeedback([])
        setLoading(true)
        const result = await AuthService.login(data)
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
        login,
        feedback,
        loading
    }
}