import { useDispatch } from "react-redux"
import { logoutReducer } from "../slices/authSlice"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

const Logout = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        console.log('LOGOUT COMPONENT')
        dispatch(logoutReducer())
        navigate('/login')
    }, [])

    return (
        <div>Logout</div>
    )
}

export default Logout