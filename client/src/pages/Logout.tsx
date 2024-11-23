import { useDispatch } from "react-redux"
import { logout } from "../slices/AuthSlice"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

const Logout = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        console.log('LOGOUT COMPONENT')
        dispatch(logout())
        navigate('/login')
    }, [])

    return (
        <div>Logout</div>
    )
}

export default Logout