import validateResponse from "../utils/validateResponse"
import { CustomError } from "./AuthService"

const BASE_URL = import.meta.env.VITE_BASE_API_URL
const API_URL_LISTFRIENDS = `${BASE_URL}/friendship` 
const API_URL_LISTRECEIVED = `${BASE_URL}/friendship/received` 
const API_URL_LISTSENT = `${BASE_URL}/friendship/sent` 
const API_URL_SENDREQUEST = `${BASE_URL}/friendship/send` 
const API_URL_ACCEPTREQUEST = `${BASE_URL}/friendship/accept` 
const API_URL_DENYREQUEST = `${BASE_URL}/friendship/deny` 
const API_URL_DELETEFRIENDSHIP = `${BASE_URL}/friendship/delete` 

class FriendshipService {

    static async listFriends() {
        try {
            
            const url = `${API_URL_LISTFRIENDS}`

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

    static async listReceivedRequests() {
        try {
            
            const url = `${API_URL_LISTRECEIVED}`

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

    static async listSentRequests() {
        try {
            
            const url = `${API_URL_LISTSENT}`

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

    static async sendRequest(friendshipId:number) {
        try {
            
            const url = `${API_URL_SENDREQUEST}/${friendshipId}`

            const response = await fetch(url, {
                method: 'POST',
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

    static async acceptRequest(friendshipId:number) {
        try {
            
            const url = `${API_URL_ACCEPTREQUEST}/${friendshipId}`

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            
            const parsedResponse = await response.json()
            validateResponse(response, parsedResponse)

            console.log('parsedResponse: ', parsedResponse)

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

    static async denyRequest(friendshipId:number) {
        try {
            
            const url = `${API_URL_DENYREQUEST}/${friendshipId}`

            const response = await fetch(url, {
                method: 'DELETE',
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

    static async deleteFriendship(friendshipId:number) {
        try {
            
            const url = `${API_URL_DELETEFRIENDSHIP}/${friendshipId}`

            const response = await fetch(url, {
                method: 'DELETE',
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

}

export default FriendshipService