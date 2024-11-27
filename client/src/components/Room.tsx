import { useEffect } from 'react'
import { useGetAllUsers } from '../hooks/useGetAllUsers'
import { useSelector } from 'react-redux'

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
                            <button className='border-2 border-black p-2'>chat</button>
                        </div>
                    ))
                }
            </div>


        </div>
    )
}

export default Room