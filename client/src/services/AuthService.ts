import validateResponse from "../utils/validateResponse"

export class CustomError extends Error {

    details: string[]

    constructor(message:string, details:string[]=[]) {
        super(message)
        this.details = details
    }
}

export interface RegisterData {
    username: string
    password: string
}

export interface LoginData {
    username: string
    password: string
}

const API_URL_REGISTER = 'http://localhost:3000/api/user/register'
const API_URL_LOGIN = 'http://localhost:3000/api/user/login'
const API_URL_LOGOUT = 'http://localhost:3000/api/user/logout'
const API_URL_PROFILE = 'http://localhost:3000/api/user/me'

class AuthService {

    static async register(data:RegisterData) {

        try {
            
            const url = `${API_URL_REGISTER}`

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    password: data.password,
                    username: data.username,
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
                details: ['Servidor inativo no momento.']
            }

        }
    }

    static async login(data:LoginData) {
        try {
            
            const url = `${API_URL_LOGIN}`

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: data.username,
                    password: data.password,
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
                details: ['Servidor inativo no momento.']
            }

        }
    }

    static async logout() {
        try {
            
            const url = `${API_URL_LOGOUT}`

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
                details: ['Servidor inativo no momento.']
            }
        }
    }

    static async profile() {
        try {
            
            const url = `${API_URL_PROFILE}`

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
                details: ['Servidor inativo no momento.']
            }
        }  
    }
}

export default AuthService