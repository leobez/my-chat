import { UpdateUserData } from "../hooks/userHooks/useUpdateUser"
import validateResponse from "../utils/validateResponse"
import { CustomError } from "./AuthService"

const BASE_URL = import.meta.env.VITE_BASE_API_URL
const API_URL_GETUSERBYID = `${BASE_URL}/user/byid`
const API_URL_UPDATEUSER = `${BASE_URL}/user/update` 

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
                details: ['Try again later.']
            }

        }
    }

    static async updateUser(updateUserData:UpdateUserData) {

        try {
            
            const url = `${API_URL_UPDATEUSER}/${updateUserData.userId}`

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    updateData: updateUserData
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
                details: ['Try again later.']
            }

        }
    }

}

export default UserService
