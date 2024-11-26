import { useState } from "react"
import { useDispatch } from "react-redux"
import { loginReducer } from "../slices/authSlice"

const API_URL = "http://localhost:3000/api/user"

export const useRegister = () => {

    const [serverSideFeedback, setServerSideFeedback] = useState<string|null>("")
    const dispatch = useDispatch()

    const register = async(email:string, username:string, password:string) => {

        try {

            const url = `${API_URL}/register`

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
            })

            const data = await response.json()

            // Resonse code not between 200 - 299
            if (!response.ok) {
                console.log('All details: ', data.details)
                console.log('Error Message: ', data.message)
                throw new Error(`${data.details[0]}`)
            }

            // User was succesfully created on backend. Login him automatically.
            if (data.message === 'User created') {
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
        register,
        serverSideFeedback,
    }
}