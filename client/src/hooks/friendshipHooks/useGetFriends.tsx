import { useState } from "react"
import { useDispatch } from "react-redux"

const API_URL = "http://localhost:3000/api/friendship"

export const useGetFriends = () => {

    const [serverSideFeedback, setServerSideFeedback] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [friendsList, setFriendsList] = useState<any[]>([])
    const dispatch = useDispatch()

    const getFriends = async() => {
        
        setServerSideFeedback([])

        try {

            const url = `${API_URL}/`

            setLoading(true)

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include' // VERY IMPORTANT -> ALLOWS TO SEND/SAVE COOKIES (SESSION TOKEN IS STORED THERE)
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
            
            setFriendsList(data.data)

        } catch (error:any) {
            console.log(error)
            setLoading(false)
        }
    }

    return {
        getFriends,
        serverSideFeedback,
        friendsList,
        loading
    }
}