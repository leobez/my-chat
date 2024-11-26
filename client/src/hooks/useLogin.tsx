import { useState } from "react"
import { useDispatch } from "react-redux"
import { loginReducer } from "../slices/authSlice"

const API_URL = "http://localhost:3000/api/user"

export const useLogin = () => {

    const [serverSideFeedback, setServerSideFeedback] = useState<string|null>("")
    const dispatch = useDispatch()

    const login = async(email:string, password:string) => {

        try {

            const url = `${API_URL}/login`

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

            // Resonse code not between 200 - 299
            if (!response.ok) {
                console.log('All details: ', data.details)
                console.log('Error Message: ', data.message)
                throw new Error(`${data.details[0]}`)
            }
            
            // User sent valid info to backend. Log him in on frontend.
            if (data.message === 'User logged') {
                dispatch(loginReducer(
                    {
                        email: data.data.email,
                        username: data.data.username
                    }
                ))
                return;
            }

            // If code got here, something is wrong with server
            throw new Error(`Missing code`)

        } catch (error:any) {
            console.log(error)
            if (error.message) {
                setServerSideFeedback(error.message)
            }
        }
    }

    return {
        login,
        serverSideFeedback,
    }
}