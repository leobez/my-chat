import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useLogout } from "../../hooks/authHooks/useLogout"

const Logout = () => {

    const navigate = useNavigate()
    const {logout, loading} = useLogout()

    useEffect(() => {
        logout()
        navigate('/login')
    }, [])

    if (loading) return (
        <>
        </>
    );
}

export default Logout