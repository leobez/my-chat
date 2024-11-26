import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { io } from "socket.io-client";
import { loginReducer } from "../slices/authSlice";
import Room from "../components/Room";

const SOCKET_URL = "http://localhost:3000"

const Home = () => {

  const user = useSelector((state:any) => state.auth)
  const isLogged = useSelector((state:any) => state.auth.isLoggedIn)

  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {

    // Somehow user got into home page without being logged in
    if (!isLogged) return;

    const socket = io(SOCKET_URL)

    const onConnect = () => setIsConnected(true)
    const onDisconnect = () => setIsConnected(false)
    const onEvent = (value:any) => setEvents((prev) => [...prev, value])

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('event', onEvent)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('event', onEvent)
    }

  }, [isLogged])


  return (
    
    <div>

      <p>HOME</p>

      <p>DATA: </p>

      <p>isConnected: {isConnected ? `True` : `False`}</p>

      <Room/>

    </div>
  )
}

export default Home