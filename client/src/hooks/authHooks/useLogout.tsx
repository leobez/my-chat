import { useContext, useState } from "react"
import { useDispatch } from "react-redux"
import { logoutUser } from "../../slices/authSlice"
import { resetFriendshipState } from "../../slices/friendshipSlice"
import { resetMessageState } from "../../slices/messageSlice"
import AuthService from "../../services/AuthService"
import SocketContext, { SocketContextType } from "../../context/SocketContext"

export const useLogout = () => {

    const [feedback, setFeedback] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const {disconnect} = useContext(SocketContext) as SocketContextType

    const logout = async() => {

        setFeedback([])
        setLoading(true)
        const result = await AuthService.logout()
        setLoading(false)

        if (!result.success && result.details) return setFeedback(result.details)
        
        // Terminate ws connection
        disconnect()
        
        // Reset states
        dispatch(resetFriendshipState())
        dispatch(resetMessageState())
        dispatch(logoutUser())    
    }

    return {
        logout,
        feedback,
        loading,
    }
}