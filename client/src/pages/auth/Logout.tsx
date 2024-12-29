import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useLogout } from "../../hooks/authHooks/useLogout"
import Loading from "../../components/Loading"

const Logout = () => {

    const navigate = useNavigate()
    const {logout, loading} = useLogout()

    useEffect(() => {
        logout()
        navigate('/login')
    }, [])

    if (loading) {
        return (
            <>
                <Loading/>
            </>
        );
    }
}

export default Logout