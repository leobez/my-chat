import { useState } from "react"
import { useDispatch } from "react-redux"
import { logoutReducer } from "../../../slices/authSlice"

const API_URL = "http://localhost:3000/api/user"

export const useLogout = () => {

    const [serverSideFeedback, setServerSideFeedback] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const logout = async() => {

        setServerSideFeedback([])

        try {

            const url = `${API_URL}/logout`

            setLoading(false)

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })

            const data = await response.json()
            console.log(data)
            setLoading(false)

            // Resonse code not between 200 - 299
            if (!response.ok) {
                if (data.details) {
                    setServerSideFeedback(data.details)
                }
                return;
            }

            // User sent valid info to backend. Log him out on frontend.
            dispatch(logoutReducer())

        } catch (error:any) {
            console.log(error)
            setLoading(false)
        }
    }

    return {
        logout,
        loading,
        serverSideFeedback,
    }
}