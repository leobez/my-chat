import { useState } from "react"
import { useDispatch } from "react-redux"
import { loginReducer } from "../slices/authSlice"

const API_URL = "http://localhost:3000/api/user"

export const useGetMe = () => {

    const [serverSideFeedback, setServerSideFeedback] = useState<string|null>("")
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const me = async() => {

        try {

            const url = `${API_URL}/me`

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include' // VERY IMPORTANT -> ALLOWS TO SEND/SAVE COOKIES (SESSION TOKEN IS STORED THERE)
            })

            const data = await response.json()

            // Resonse code not between 200 - 299
            if (!response.ok) {
                console.log('All details: ', data.details)
                console.log('Error Message: ', data.message)
                if (data.message === 'Bad request') {
                    setServerSideFeedback(data.details)
                }
                return;
            }
            
            if (data.loggedIn) {
                dispatch(loginReducer(
                    {
                        userId: data.data.id,
                        email: data.data.email,
                        username: data.data.username
                    }
                ))
            } 

        } catch (error:any) {
            console.log(error)
            setLoading(false)
        }
    }

    return {
        me,
        serverSideFeedback,
    }
}