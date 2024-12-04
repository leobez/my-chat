import { useState } from "react"

const API_URL = "http://localhost:3000/api/message"

export const useGetHistory = () => {

    const [serverSideFeedback, setServerSideFeedback] = useState<string|null>("")
    const [history, setHistory] = useState<any[]>([])


    const getHistoryWithThisUser = async(id:string) => {

        try {

            const url = `${API_URL}/with?user=${id}`

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

            console.log('history: ', data.data)
            setHistory(data.data)

        } catch (error:any) {
            console.log(error)
            if (error.message) {
                setServerSideFeedback(error.message)
            }
        }
    }

    return {
        getHistoryWithThisUser,
        history,
        serverSideFeedback,
    }
}