import { useState } from "react"
import { useDispatch } from "react-redux"
import { loginReducer } from "../slices/authSlice"

const API_URL = "http://localhost:3000/api"

export const useLogin = () => {

    const [serverSideFeedback, setServerSideFeedback] = useState<string|null>("")
    const dispatch = useDispatch()

    const login = async(email:string, password:string) => {

        try {
            const URL = `${API_URL}/login`
            const RESULT = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
                credentials: 'include' // VERY IMPORTANT -> SEND/SAVE COOKIES (SESSION TOKEN IS STORED THERE)
            })

            const DATA = await RESULT.json()
            console.log('DATA: ', DATA)

            if (DATA.message === 'logged') {
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
        login,
        serverSideFeedback,
    }
}