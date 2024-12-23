import { useEffect } from 'react'
import { useGetAllUsers } from '../hooks/userHooks/useGetAllUsers'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Room = () => {

    const {getAllUsers, users, serverSideFeedback} = useGetAllUsers()

    const currentUser = useSelector((state:any) => state.auth)

    useEffect(() => {

        getAllUsers()

    }, [])

    return (
        <div>
            <p>ALL USERS</p>
            
            <div className='flex gap-2'>
                {users && 
                    users.map((user) => (
                        <div className='h-fit w-fit p-3 border-black border' key={user.id}>
                            {currentUser.email === user.email && <p>thats me lol</p>}
                            <p>{user.username}</p>
                            <p>{user.email}</p>
                            <div className='border-2 border-black p-2'>
                                <Link to={`/chat/${user.id}`}>chat</Link>
                            </div>
                        </div>
                    ))
                }
            </div>


        </div>
    )
}

export default Room