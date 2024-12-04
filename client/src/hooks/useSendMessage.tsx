import { useState } from "react"

const API_URL = "http://localhost:3000/api/user"

export const useSendMessage = () => {

    const [serverSideFeedback, setServerSideFeedback] = useState<string|null>("")

    const sendMessage = async(message:string, from:string, to:string) => {

        try {

            const url = `${API_URL}/all`

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


        } catch (error:any) {
            console.log(error)
            if (error.message) {
                setServerSideFeedback(error.message)
            }
        }
    }

    return {
        serverSideFeedback,
    }
}