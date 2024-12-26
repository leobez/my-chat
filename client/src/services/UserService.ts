import validateResponse from "../utils/validateResponse"
import { CustomError } from "./AuthService"

const API_URL_GETUSERBYID = 'http://localhost:3000/api/user/byid'

class UserService {

    static async getUserById(userId:number) {
        try {
            
            const url = `${API_URL_GETUSERBYID}/${userId}`

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

}

export default UserService
