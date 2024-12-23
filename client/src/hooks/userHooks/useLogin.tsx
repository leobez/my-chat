import { useState } from "react"
import { useDispatch } from "react-redux"
import { loginReducer } from "../../slices/authSlice"

const API_URL = "http://localhost:3000/api/user"

export const useLogin = () => {

    const [serverSideFeedback, setServerSideFeedback] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const login = async(email:string, password:string) => {

        try {

            const url = `${API_URL}/login`

            setLoading(true)

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
                credentials: 'include' // VERY IMPORTANT -> ALLOWS TO SEND/SAVE COOKIES (SESSION TOKEN IS STORED THERE)
            })

            const data = await response.json()

            setLoading(false)

            // Resonse code not between 200 - 299
            if (!response.ok) {
                console.log('All details: ', data.details)
                console.log('Error Message: ', data.message)
                if (data.message === 'Bad request') {
                    setServerSideFeedback(data.details)
                }
                return;
            }
            
            // User sent valid info to backend. Log him in on frontend.
            if (data.message === 'User logged') {
                dispatch(loginReducer(
                    {
                        userId: data.data.id,
                        email: data.data.email,
                        username: data.data.username
                    }
                ))
                return;
                
            } else {
                // If code got here, something is wrong with server
                throw new Error(`Missing code`)
            }

        } catch (error:any) {
            console.log(error)
            setLoading(false)
        }
    }

    return {
        login,
        serverSideFeedback,
        loading
    }
}