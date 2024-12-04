import { useState } from "react"

const API_URL = "http://localhost:3000/api/user"

export const useGetById = () => {

    const [serverSideFeedback, setServerSideFeedback] = useState<string|null>("")
    const [userData, setUserData] = useState<any>()

    const getUserById = async(id:string) => {

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

            // Resonse code not between 200 - 299
            if (!response.ok) {
                console.log('All details: ', data.details)
                console.log('Error Message: ', data.message)
                throw new Error(`${data.details[0]}`)
            }

            setUserData(data.data)

        } catch (error:any) {
            console.log(error)
            if (error.message) {
                setServerSideFeedback(error.message)
            }
        }
    }

    return {
        getUserById,
        userData,
        serverSideFeedback,
    }
}