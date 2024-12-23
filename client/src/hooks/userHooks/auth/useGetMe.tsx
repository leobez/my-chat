import { useState } from "react"
import { useDispatch } from "react-redux"
import { loginReducer } from "../../../slices/authSlice"

const API_URL = "http://localhost:3000/api/user"

export const useGetMe = () => {

    const [serverSideFeedback, setServerSideFeedback] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const me = async() => {

        setServerSideFeedback([])

        try {

            const url = `${API_URL}/me`

            setLoading(true)

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include' // VERY IMPORTANT -> ALLOWS TO SEND/SAVE COOKIES (SESSION TOKEN IS STORED THERE)
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
            
            dispatch(loginReducer(
                {
                    userId: data.data.userId,
                    email: data.data.email,
                    username: data.data.username
                }
            ))  

        } catch (error:any) {
            console.log(error)
            setLoading(false)
        }
    }

    return {
        me,
        loading,
        serverSideFeedback,
    }
}