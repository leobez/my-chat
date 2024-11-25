import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { io } from "socket.io-client";
import { loginReducer } from "../slices/authSlice";

const SOCKET_URL = "http://localhost:3000"

const Home = () => {

  const user = useSelector((state:any) => state.auth)
  const isLogged = useSelector((state:any) => state.auth.isLoggedIn)

  const dispatch = useDispatch()

  useEffect(() => {
    // Somehow user got into home page without being logged in
    if (!isLogged) return;

    const socket = io(SOCKET_URL) // MAYBE FIX THIS, BEING EXECUTED TWICE ON REFRESH
    dispatch(loginReducer({socket: socket})) // TODO: NON-SERIALIZABLE THROWS ERROR, BUT NON LETHAL. FIND BETTER SOLUTION

    console.log('USER STATUS: ', user)
  }, [isLogged])

  return (
    <div>
      Home
    </div>
  )
}

export default Home