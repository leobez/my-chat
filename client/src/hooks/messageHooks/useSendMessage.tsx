import { useState } from "react"

const API_URL = "http://localhost:3000/api/message"

export const useSendMessage = () => {

    const [serverSideFeedback, setServerSideFeedback] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const sendMessage = async(message:string, to:string|number) => {

        setServerSideFeedback([])

        try {

            const url = `${API_URL}/${to}`

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: message,
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

            return data.data

        } catch (error:any) {
            console.log(error)
            setLoading(false)
        }
    }

    return {
        serverSideFeedback,
        loading,
        sendMessage
    }
}