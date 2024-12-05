import { useEffect, useState } from "react"

const API_URL = "http://localhost:3000/api/message"

export const useGetHistory = () => {

    const [serverSideFeedback, setServerSideFeedback] = useState<string|null>("")
    const [history, setHistory] = useState<any[]>([])

    useEffect(() => {
        console.log('history: ', history)
    }, [history])

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

    const addToHistory = (message:any) => {
        console.log('adding to history: ', message)
        setHistory((prev:any) => [...prev, message])
    }

    return {
        getHistoryWithThisUser,
        addToHistory,
        history,
        serverSideFeedback,
    }
}