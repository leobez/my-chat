import { CustomError } from "../services/AuthService"

export default function validateResponse(response:Response, parsedResponse:any) {
    if (!response.ok) {
        if (parsedResponse.details) {
            throw new CustomError('Server error', parsedResponse.details)
        } else {
            // For some reason there are no details coming from backend
            throw new CustomError('Server error', ['Something went wrong. Try again later'])
        }
    }
}