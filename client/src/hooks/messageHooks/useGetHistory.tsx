import { useEffect, useState } from "react"

const API_URL = "http://localhost:3000/api/message"

export const useGetHistory = () => {

    const [serverSideFeedback, setServerSideFeedback] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [history, setHistory] = useState<any[]>([])

    useEffect(() => {
        console.log('history: ', history)
    }, [history])

    const getHistoryWithThisUser = async(id:string|number) => {

        setServerSideFeedback([])

        try {

            const url = `${API_URL}/history/${id}`

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

            setHistory(data.data)

        } catch (error:any) {
            console.log(error)
            setLoading(false)
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
        loading,
        serverSideFeedback,
    }
}