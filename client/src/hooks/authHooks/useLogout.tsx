import { useContext, useState } from "react"
import { useDispatch } from "react-redux"
import { logoutUser } from "../../slices/authSlice"
import { resetFriendshipState } from "../../slices/friendshipSlice"
import { resetMessageState } from "../../slices/messageSlice"
import AuthService from "../../services/AuthService"
import SocketContext, { SocketContextType } from "../../context/SocketContext"
import SnackbarContext, { SnackbarContextType } from "../../context/SnackbarContext"

export const useLogout = () => {

    const [feedback, setFeedback] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const {disconnect} = useContext(SocketContext) as SocketContextType

    const {handleSnackbar} = useContext(SnackbarContext) as SnackbarContextType

    const logout = async() => {

        setFeedback([])
        setLoading(true)
        const result = await AuthService.logout()
        setLoading(false)

        if (!result.success && result.details) {
            return handleSnackbar({open: true, message: result.details[0], severity: 'error'})
        }
        
        // Terminate ws connection
        disconnect()
        
        // Reset states
        dispatch(resetFriendshipState())
        dispatch(resetMessageState())
        dispatch(logoutUser())    

        handleSnackbar({open: true, message: 'User logged out', severity: 'success'})
    }

    return {
        logout,
        feedback,
        loading,
    }
}