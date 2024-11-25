import { useState } from "react"
import { useDispatch } from "react-redux"
import { loginReducer } from "../slices/authSlice"

const API_URL = "http://localhost:3000/api/user"

export const useRegister = () => {

    const [serverSideFeedback, setServerSideFeedback] = useState<string|null>("")
    const dispatch = useDispatch()

    const register = async(email:string, username:string, password:string) => {

        try {

            const URL = `${API_URL}/register`
            const RESULT = await fetch(URL, {
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

            const DATA = await RESULT.json()
            console.log('DATA: ', DATA)

            // Auto login user after succesfull register
            if (DATA.user) {
                dispatch(loginReducer({email:DATA.user.email, username:DATA.user.username}))
            }


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