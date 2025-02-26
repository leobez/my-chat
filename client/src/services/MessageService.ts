import validateResponse from "../utils/validateResponse"
import { CustomError } from "./AuthService"

const BASE_URL = import.meta.env.VITE_BASE_API_URL
const API_URL_HISTORY = `${BASE_URL}/message/history`
const API_URL_SENDMESSAGE = `${BASE_URL}/message`

class MessageService {

    static async getHistoryWithUser(userId:number) {

        try {
                    
            const url = `${API_URL_HISTORY}/${userId}`

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            
            const parsedResponse = await response.json()
            validateResponse(response, parsedResponse)

            return {
                success: true,
                data: parsedResponse.data
            }

        } catch (error) {

            if (error instanceof CustomError) {
                return {
                    success: false,
                    details: error.details
                }
            }

            return {
                success: false,
                details: ['Client error. Try again later.']
            }

        }
    }

    static async sendMessageTo(userId:number, content:string) {

        try {
                    
            const url = `${API_URL_SENDMESSAGE}/${userId}`

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: content
                }),
                credentials: 'include'
            })
            
            const parsedResponse = await response.json()
            validateResponse(response, parsedResponse)

            return {
                success: true,
                data: parsedResponse.data
            }

        } catch (error) {

            if (error instanceof CustomError) {
                return {
                    success: false,
                    details: error.details
                }
            }

            return {
                success: false,
                details: ['Client error. Try again later.']
            }

        } 
    }

}

export default MessageService