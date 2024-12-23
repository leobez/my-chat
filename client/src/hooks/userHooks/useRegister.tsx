import { useState } from "react"
import { useDispatch } from "react-redux"
import { loginReducer } from "../../slices/authSlice"

const API_URL = "http://localhost:3000/api/user"

export const useRegister = () => {

    const [serverSideFeedback, setServerSideFeedback] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const register = async(email:string, username:string, password:string) => {
        
        setServerSideFeedback([])

        try {

            const url = `${API_URL}/register`

            setLoading(true)

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    username:username,
                    password: password
                }),
                credentials: 'include'
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

            // User was succesfully created on backend. Login him automatically.
            if (data.message === 'User created') {
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
            console.log('Error: ', error)
            setLoading(false)
        }
    }

    return {
        register,
        serverSideFeedback,
        loading
    }
}