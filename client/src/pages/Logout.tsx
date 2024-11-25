import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useLogout } from "../hooks/useLogout"

const Logout = () => {

    const navigate = useNavigate()
    const {logout} = useLogout()

    useEffect(() => {
        logout()
        navigate('/login')
    }, [])

    return (
        <div>Logout</div>
    )
}

export default Logout