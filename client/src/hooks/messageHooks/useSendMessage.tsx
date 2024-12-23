import { useState } from "react"

const API_URL = "http://localhost:3000/api/message"

export const useSendMessage = () => {

    const [serverSideFeedback, setServerSideFeedback] = useState<string|null>("")

    const sendMessage = async(message:string, from:string, to:string) => {

        try {

            const url = `${API_URL}`

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: message,
                    from: from,
                    to: to
                }),
                credentials: 'include'
            })

            const data = await response.json()

            // Resonse code not between 200 - 299
            if (!response.ok) {
                console.log('All details: ', data.details)
                console.log('Error Message: ', data.message)
                throw new Error(`${data.details[0]}`)
            }

            return data.data

        } catch (error:any) {
            console.log(error)
            if (error.message) {
                setServerSideFeedback(error.message)
            }
        }
    }

    return {
        serverSideFeedback,
        sendMessage
    }
}