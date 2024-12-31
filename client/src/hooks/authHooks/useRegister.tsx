import { useContext, useState } from "react"
import { useDispatch } from "react-redux"
import { loginUser } from "../../slices/authSlice"
import AuthService, { RegisterData } from "../../services/AuthService"
import SnackbarContext, { SnackbarContextType } from "../../context/SnackbarContext"

export const useRegister = () => {

    const [feedback, setFeedback] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const {handleSnackbar} = useContext(SnackbarContext) as SnackbarContextType

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
    
        handleSnackbar({open: true, message: 'User logged in', severity: 'success'})

    }

    return {
        register,
        feedback,
        loading
    }
}