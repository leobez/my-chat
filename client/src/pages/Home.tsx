import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000"

const Home = () => {

  const user = useSelector((state:any) => state.auth)
  const email = useSelector((state:any) => state.auth.email)
  const isLogged = useSelector((state:any) => state.auth.isLoggedIn)

  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    console.log('users: ', users)
  }, [users])

  useEffect(() => {

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

  }, [isLogged])


  return (
    
    <div className="flex gap-2">
      {users && users.length > 0 && users.map((user:any, index:number) => (
            <div key={index} className="border border-black p-3">
              <Link to={`chat/${user.userId}`}>
                {user.email}
              </Link>
            </div>
      ))}

    </div>

  )
}

export default Home