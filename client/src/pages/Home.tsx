import { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom";
import SocketContext, { SocketContextType } from "../context/SocketContext";


const Home = () => {

    const user = useSelector((state:any) => state.auth)
    const email = useSelector((state:any) => state.auth.email)
    const isLogged = useSelector((state:any) => state.auth.isLoggedIn)

    const [users, setUsers] = useState<any[]>([])

    const {socket, connect, disconnect} = useContext(SocketContext) as SocketContextType

    useEffect(() => {

      // User somehow got here wihout being logged
      if (!isLogged) return;

      // Connect to server via websockets
      connect()

    }, [isLogged])

/*   useEffect(() => {

    // Somehow user got into home page without being logged in
    if (!isLogged) return;

    const socket = io(SOCKET_URL, {autoConnect: false})

    socket.onAny((event, ...args) => {
      console.log(event, args)
    })

    socket.auth = { email }

    socket.connect()

    socket.on('connect_error', (err) => {
      if (err.message === 'No email') {
          console.log('No email')
          return;
      }
    })

    socket.on('users', (users:any[]) => {

      users.forEach((user:any) => {
          user.self = user.userId === socket.id
      });

      //console.log('users: ', users)
      setUsers(users)
    })

    socket.on('user connected', (user) => {
      setUsers((prev:any) => [...prev, user])
    })

    return () => {
        socket.off('connect_error')
        socket.disconnect()
    }

  }, [isLogged]) */


    return (
      
      <div className="flex gap-2">
        <p>HOME</p>

      </div>

    )
}

export default Home