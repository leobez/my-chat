import { useState } from "react"
import { useDispatch } from "react-redux"
import { logoutReducer } from "../slices/authSlice"

const API_URL = "http://localhost:3000/api/user"

export const useLogout = () => {

    const [serverSideFeedback, setServerSideFeedback] = useState<string|null>("")
    const dispatch = useDispatch()

    const logout = async() => {

        try {

            const URL = `${API_URL}/logout`

            const DATA = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })

            const RESULT = await DATA.json()

            console.log('RESULT: ', RESULT)

            dispatch(logoutReducer())

        } catch (error:any) {
            console.log(error)
            if (error.message) {
                setServerSideFeedback(error.message)
            }
        }
    }

    return {
        logout,
        serverSideFeedback,
    }
}