import { useState } from "react"
import { useDispatch } from "react-redux"
import { logoutUser } from "../../slices/authSlice"
import AuthService from "../../services/AuthService"

export const useLogout = () => {

    const [feedback, setFeedback] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const logout = async() => {

        setFeedback([])
        setLoading(true)
        const result = await AuthService.logout()
        setLoading(false)

        if (!result.success && result.details) return setFeedback(result.details)

        dispatch(logoutUser())    
    }

    return {
        logout,
        feedback,
        loading,
    }
}