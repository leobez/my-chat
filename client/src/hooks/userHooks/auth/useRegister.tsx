import { useState } from "react"
import { useDispatch } from "react-redux"
import { loginReducer } from "../../../slices/authSlice"

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
                    userId: data.data.id,
                    email: data.data.email,
                    username: data.data.username
                }
            ))

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