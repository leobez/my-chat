import { useState } from "react"

const API_URL = "http://localhost:3000/api/user"

export const useGetUserById = () => {

    const [serverSideFeedback, setServerSideFeedback] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [userData, setUserData] = useState<any>()

    const getUserById = async(id:string|number) => {

        setServerSideFeedback([])

        try {

            const url = `${API_URL}/byid/${id}`

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
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

            setUserData(data.data)

        } catch (error:any) {
            console.log(error)
            setLoading(false)
        }
    }

    return {
        getUserById,
        userData,
        loading,
        serverSideFeedback,
    }
}