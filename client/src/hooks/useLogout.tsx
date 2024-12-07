import { useState } from "react"
import { useDispatch } from "react-redux"
import { logoutReducer } from "../slices/authSlice"

const API_URL = "http://localhost:3000/api/user"

export const useLogout = () => {

    const [serverSideFeedback, setServerSideFeedback] = useState<string|null>("")
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const logout = async() => {

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

            setLoading(true)

            // Resonse code not between 200 - 299
            if (!response.ok) {
                console.log('All details: ', data.details)
                console.log('Error Message: ', data.message)
                throw new Error(`${data.details[0]}`)
            }

            // User sent valid info to backend. Log him out on frontend.
            if (data.message === 'User logged out') {
                dispatch(logoutReducer())
                return;
            }
            
            // If code got here, something is wrong with server
            throw new Error(`Missing code`)

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