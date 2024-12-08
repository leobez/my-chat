import { useState } from "react"

const API_URL = "http://localhost:3000/api/user"

export const useSendFriendRequest = () => {

    const [serverSideFeedback, setServerSideFeedback] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const sendFriendRequest = async(to:string, from:string) => {

        try {

            const url = `${API_URL}/add`

            setLoading(true)

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: to,
                    from: from
                }),
                credentials: 'include' // VERY IMPORTANT -> ALLOWS TO SEND/SAVE COOKIES (SESSION TOKEN IS STORED THERE)
            })

            const data = await response.json()

            setLoading(false)

            // Resonse code not between 200 - 299
            if (!response.ok) {
                console.log('All details: ', data.details)
                console.log('Error Message: ', data.message)
                if (data.message === 'Bad request') {
                    setServerSideFeedback(data.details)
                }
                return;
            }

        } catch (error:any) {
            console.log(error)
            setLoading(false)
        }
    }

    return {
        sendFriendRequest,
        serverSideFeedback,
        loading
    }
}