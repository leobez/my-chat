import { useState } from "react"
import { useDispatch } from "react-redux"
import { loginUser } from "../../slices/authSlice"
import AuthService from "../../services/AuthService"

export const useGetMe = () => {

    const [feedback, setFeedback] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const me = async() => {

        setFeedback([])
        setLoading(true)
        const result = await AuthService.profile()
        setLoading(false)

        if (!result.success && result.details) setFeedback(result.details)
        
        dispatch(loginUser(
            {
                userId: result.data.userId,
                email: result.data.email,
                username: result.data.username
            }
        ))     

    }

    return {
        me,
        feedback,
        loading,
    }
}